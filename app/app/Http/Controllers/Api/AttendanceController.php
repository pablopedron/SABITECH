<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TalkUser;
use App\Models\UserTalkQr;
use App\Services\QrToken;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Asistencia con QR temporal (prototipo del checkpoint).
 */
class AttendanceController extends Controller
{
    /**
     * GET /api/reservations/{id}/qr
     *
     * El asistente pide el código actual de SU reserva. El frontend lo pinta como QR y
     * vuelve a pedirlo cuando pasan los segundos de seconds_left.
     */
    public function qr(Request $request, int $id, QrToken $qr): JsonResponse
    {
        $reserva = TalkUser::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        // La reserva de otra persona responde 404, igual que al cancelar
        if (! $reserva) {
            abort(404, 'Reserva no encontrada.');
        }
        if ($reserva->status !== 'confirmada') {
            abort(409, 'La reserva está cancelada: no tiene código QR.');
        }

        $ventana = $qr->ventanaActual();

        return response()->json([
            'token' => $qr->generar($reserva, $ventana),
            'window' => $ventana,
            'valid_until' => now()->setTimestamp(($ventana + 1) * QrToken::SEGUNDOS_VENTANA)->toIso8601String(),
            'seconds_left' => $qr->segundosRestantes(),
        ]);
    }

    /**
     * POST /api/attendances/scan  {"token": "..."}   (solo personal_acceso)
     *
     * El personal de acceso escanea el QR. Si el código es válido se registra la asistencia
     * una sola vez; repetirla responde 409 sin crear otra fila.
     */
    public function scan(Request $request, QrToken $qr): JsonResponse
    {
        $data = $request->validate(['token' => ['required', 'string', 'max:200']]);

        [$reserva, $ventana] = $qr->comprobar($data['token']);

        $yaRegistrada = UserTalkQr::where('user_id', $reserva->user_id)
            ->where('talk_id', $reserva->talk_id)
            ->exists();

        if ($yaRegistrada) {
            abort(409, 'La asistencia de esta persona a esta charla ya estaba registrada.');
        }

        try {
            $asistencia = UserTalkQr::create([
                'user_id' => $reserva->user_id,
                'talk_id' => $reserva->talk_id,
                'checked_in_at' => now(),
                'validated_by' => $request->user()->id,
                'method' => 'qr',
                'qr_window' => $ventana,
            ]);
        } catch (UniqueConstraintViolationException) {
            // Red de seguridad: dos escaneos a la vez. La restricción única de la base de datos manda.
            abort(409, 'La asistencia de esta persona a esta charla ya estaba registrada.');
        }

        $reserva->load(['user', 'talk']);

        return response()->json([
            'message' => 'Asistencia registrada.',
            'attendee' => $reserva->user->name,
            'talk' => $reserva->talk->title,
            'reference' => $reserva->reference,
            'checked_in_at' => $asistencia->checked_in_at->toIso8601String(),
        ], 201);
    }
}
