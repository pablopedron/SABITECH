<?php

namespace App\Services;

use App\Mail\ReservaConfirmada;
use App\Models\EmailLog;
use App\Models\TalkUser;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

/**
 * Envía el correo de confirmación de una reserva y deja constancia en email_logs.
 *
 * Se llama DESPUÉS de guardar la reserva: si el servidor de correo falla, la reserva
 * sigue guardada y el fallo queda registrado (status = 'fallido') para reintentarlo.
 */
class CorreoReserva
{
    public function enviarConfirmacion(TalkUser $reserva): EmailLog
    {
        $reserva->loadMissing(['user', 'talk.location']);

        // Primero se apunta como pendiente: así, si algo se rompe a mitad, queda rastro.
        $registro = EmailLog::create([
            'user_id' => $reserva->user_id,
            'talk_id' => $reserva->talk_id,
            'talk_user_id' => $reserva->id,
            'type' => 'confirmacion',
            'recipient' => $reserva->user->email,
            'subject' => ReservaConfirmada::asunto($reserva),
            'status' => 'pendiente',
        ]);

        try {
            Mail::to($reserva->user->email)->send(new ReservaConfirmada($reserva));

            $registro->update(['status' => 'enviado', 'sent_at' => now()]);
        } catch (Throwable $e) {
            // Al usuario no se le enseña el error técnico; se guarda para revisarlo.
            Log::warning("No se pudo enviar el correo de la reserva {$reserva->reference}: {$e->getMessage()}");

            $registro->update([
                'status' => 'fallido',
                'error_message' => mb_substr($e->getMessage(), 0, 255),
            ]);
        }

        return $registro;
    }
}
