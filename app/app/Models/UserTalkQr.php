<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Registro de asistencia (check-in) y valoración. Tabla user_talk_qr.
 */
class UserTalkQr extends Model
{
    protected $table = 'user_talk_qr';

    public $timestamps = false;

    protected $fillable = [
        'user_id', 'talk_id', 'checked_in_at', 'validated_by', 'method',
        'qr_window', 'rating', 'feedback_comment',
    ];

    protected function casts(): array
    {
        return [
            'checked_in_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function validator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'validated_by');
    }
}
