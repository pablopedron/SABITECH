<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Forma pública de una reserva. Nunca expone qr_secret.
 *
 * @mixin \App\Models\TalkUser
 */
class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'status' => $this->status,                     // confirmada | cancelada
            'registered_at' => $this->registered_at?->toIso8601String(),
            'cancelled_at' => $this->cancelled_at?->toIso8601String(),
            'cancellation_reason' => $this->cancellation_reason,
            'talk' => new TalkResource($this->whenLoaded('talk')),
        ];
    }
}
