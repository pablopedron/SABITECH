<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReservationResource;
use App\Models\Talk;
use App\Models\TalkUser;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ReservationController extends Controller
{
    /**
     * POST /api/talks/{id}/inscribe
     *
     * Reserva una plaza. Todo ocurre dentro de una transacción y con la fila de la charla
     * bloqueada (lockForUpdate): si dos personas piden la última plaza a la vez, la segunda
     * espera a que termine la primera, ve que ya no quedan plazas y recibe 409.
     */
    public function store(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        try {
            $reservation = DB::transaction(function () use ($user, $id) {
                $talk = Talk::published()->whereKey($id)->lockForUpdate()->first();

                if (! $talk) {
                    abort(404, 'Charla no encontrada.');
                }
                if ($talk->starts_at->isPast()) {
                    abort(409, 'La charla ya ha empezado: no se admiten reservas.');
                }

                $existing = TalkUser::where('user_id', $user->id)
                    ->where('talk_id', $talk->id)
                    ->lockForUpdate()
                    ->first();

                if ($existing && $existing->status === 'confirmada') {
                    abort(409, 'Ya tienes una reserva para esta charla.');
                }
                if ($talk->seats_taken >= $talk->capacity) {
                    abort(409, 'No quedan plazas disponibles.');
                }

                if ($existing) {
                    // Reserva cancelada antes: se reactiva (la tabla solo admite una fila por persona y charla)
                    $existing->update([
                        'status' => 'confirmada',
                        'qr_secret' => $this->newSecret(),
                        'cancellation_reason' => null,
                        'cancelled_at' => null,
                        'registered_at' => now(),
                    ]);
                    $reservation = $existing;
                } else {
                    $reservation = TalkUser::create([
                        'reference' => $this->newReference(),
                        'user_id' => $user->id,
                        'talk_id' => $talk->id,
                        'status' => 'confirmada',
                        'qr_secret' => $this->newSecret(),
                        'registered_at' => now(),
                    ]);
                }

                $talk->increment('seats_taken');

                return $reservation;
            });
        } catch (UniqueConstraintViolationException) {
            // Red de seguridad: la restricción única (user_id, talk_id) de la base de datos
            abort(409, 'Ya tienes una reserva para esta charla.');
        }

        $reservation->load(['talk.category', 'talk.location']);

        return (new ReservationResource($reservation))->response()->setStatusCode(201);
    }

    /** GET /api/me/reservations: las reservas del usuario autenticado (confirmadas y canceladas) */
    public function index(Request $request): AnonymousResourceCollection
    {
        $reservations = $request->user()->reservations()
            ->with(['talk.category', 'talk.location'])
            ->get()
            ->sortBy(fn (TalkUser $r) => $r->talk->starts_at)
            ->values();

        return ReservationResource::collection($reservations);
    }

    /**
     * POST /api/reservations/{id}/cancel  (cuerpo opcional: {"reason": "..."})
     *
     * Solo el dueño puede cancelar su reserva; la de otra persona responde 404 para no revelar
     * que existe. Libera la plaza. No se puede cancelar una reserva ya cancelada ni una charla
     * que ya ha empezado.
     */
    public function cancel(Request $request, int $id): ReservationResource
    {
        $data = $request->validate(['reason' => ['nullable', 'string', 'max:255']]);

        $reservation = DB::transaction(function () use ($request, $id, $data) {
            $talkId = TalkUser::where('id', $id)
                ->where('user_id', $request->user()->id)
                ->value('talk_id');

            if (! $talkId) {
                abort(404, 'Reserva no encontrada.');
            }

            // Mismo orden de bloqueos que en store (primero la charla, luego la reserva)
            $talk = Talk::whereKey($talkId)->lockForUpdate()->first();
            $reservation = TalkUser::whereKey($id)->lockForUpdate()->first();

            if ($reservation->status === 'cancelada') {
                abort(409, 'La reserva ya estaba cancelada.');
            }
            if ($talk->starts_at->isPast()) {
                abort(409, 'No se puede cancelar una charla que ya ha empezado.');
            }

            $reservation->update([
                'status' => 'cancelada',
                'cancelled_at' => now(),
                'cancellation_reason' => $data['reason'] ?? null,
            ]);

            if ($talk->seats_taken > 0) {
                $talk->decrement('seats_taken');
            }

            return $reservation;
        });

        $reservation->load(['talk.category', 'talk.location']);

        return new ReservationResource($reservation);
    }

    /** Referencia legible y única que aparecerá en el correo: SBT-XXXXXX */
    private function newReference(): string
    {
        do {
            $reference = 'SBT-'.strtoupper(Str::random(6));
        } while (TalkUser::where('reference', $reference)->exists());

        return $reference;
    }

    /** Secreto del QR de esta reserva: 64 caracteres hexadecimales. No se expone nunca. */
    private function newSecret(): string
    {
        return bin2hex(random_bytes(32));
    }
}
