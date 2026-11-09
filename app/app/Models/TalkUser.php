<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Reserva (inscripción) de un usuario a una charla. Tabla talk_user.
 * La relación con Talk se añade cuando se mergee el modelo Talk (feature/catalogo).
 */
class TalkUser extends Model
{
    protected $table = 'talk_user';

    // Solo tiene registered_at (lo pone la base de datos), no created_at / updated_at
    public $timestamps = false;

    protected $fillable = [
        'reference', 'user_id', 'talk_id', 'status', 'qr_secret',
        'cancellation_reason', 'cancelled_at',
    ];

    // El secreto del QR nunca debe salir en una respuesta JSON
    protected $hidden = ['qr_secret'];

    protected function casts(): array
    {
        return [
            'registered_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
