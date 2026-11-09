<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Forma pública de una charla. No expone columnas internas
 * (created_by, seats_taken, is_published, timestamps).
 *
 * @mixin \App\Models\Talk
 */
class TalkResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'starts_at' => $this->starts_at->toIso8601String(),
            'ends_at' => $this->ends_at->toIso8601String(),
            'speaker_name' => $this->speaker_name,
            'speaker_company' => $this->speaker_company,
            'speaker_bio' => $this->speaker_bio,
            'speaker_photo' => $this->speaker_photo,
            'speaker_photo_alt' => $this->speaker_photo_alt,
            'category' => [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ],
            'location' => [
                'id' => $this->location->id,
                'name' => $this->location->name,
                'address' => $this->location->address,
            ],
            'capacity' => $this->capacity,
            'seats_available' => $this->seats_available,
        ];
    }
}
