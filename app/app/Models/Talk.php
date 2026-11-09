<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Talk extends Model
{
    protected $fillable = [
        'location_id', 'created_by', 'category_id', 'title', 'description',
        'speaker_name', 'speaker_company', 'speaker_bio', 'speaker_photo', 'speaker_photo_alt',
        'starts_at', 'ends_at', 'capacity', 'seats_taken', 'is_published',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'is_published' => 'boolean',
        ];
    }

    /** Solo charlas publicadas (las de borrador no las ve el público) */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', 1);
    }

    /** Plazas libres = aforo - plazas ocupadas */
    public function getSeatsAvailableAttribute(): int
    {
        return max(0, $this->capacity - $this->seats_taken);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(TalkUser::class);
    }
}
