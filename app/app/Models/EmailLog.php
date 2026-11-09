<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Control de correos enviados (confirmación, cancelación...). Tabla email_logs.
 */
class EmailLog extends Model
{
    protected $table = 'email_logs';

    public $timestamps = false;

    protected $fillable = [
        'user_id', 'talk_id', 'talk_user_id', 'type', 'recipient', 'subject',
        'status', 'error_message', 'attempts', 'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(TalkUser::class, 'talk_user_id');
    }
}
