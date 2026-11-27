<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TalkResource;
use App\Models\Talk;
use App\Models\UserTalkQr;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TalkController extends Controller
{
    /** GET /api/talks (público): charlas publicadas, por fecha. Filtro opcional ?category_id= */
    public function index(Request $request): AnonymousResourceCollection
    {
        $request->validate(['category_id' => ['nullable', 'integer']]);

        $talks = Talk::published()
            ->with(['category', 'location'])
            ->when($request->filled('category_id'), fn ($q) => $q->where('category_id', $request->integer('category_id')))
            ->orderBy('starts_at')
            ->get();

        return TalkResource::collection($talks);
    }

    /** GET /api/talks/{id} (público): detalle. Un borrador responde 404. */
    public function show(int $id): TalkResource
    {
        $talk = Talk::published()->with(['category', 'location'])->findOrFail($id);

        return new TalkResource($talk);
    }

    /**
     * GET /api/talks/{id}/reservations (solo organizacion)
     *
     * Inscripciones de una charla (también de borradores) y si cada persona ha asistido.
     * El permiso lo comprueba el middleware role:organizacion en la ruta, no el frontend.
     */
    public function reservations(int $id): JsonResponse
    {
        $talk = Talk::with(['reservations.user'])->findOrFail($id);

        // user_id de quienes tienen asistencia registrada en esta charla
        $asistieron = UserTalkQr::where('talk_id', $talk->id)->pluck('user_id')->all();

        $reservas = $talk->reservations
            ->sortBy('registered_at')
            ->map(fn ($r) => [
                'id' => $r->id,
                'reference' => $r->reference,
                'status' => $r->status,
                'registered_at' => $r->registered_at?->toIso8601String(),
                'user' => ['id' => $r->user->id, 'name' => $r->user->name, 'email' => $r->user->email],
                'attended' => in_array($r->user_id, $asistieron, true),
            ])
            ->values();

        return response()->json([
            'talk' => ['id' => $talk->id, 'title' => $talk->title, 'capacity' => $talk->capacity, 'seats_taken' => $talk->seats_taken],
            'data' => $reservas,
        ]);
    }
}
