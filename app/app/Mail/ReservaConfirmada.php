<?php

namespace App\Mail;

use App\Models\TalkUser;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

/**
 * Correo de confirmación de una reserva.
 * Lleva los datos que pide el enunciado: charla, fecha, horario, ubicación y referencia.
 * NO es un registro de asistencia: solo confirma que hay plaza.
 */
class ReservaConfirmada extends Mailable
{
    public function __construct(public TalkUser $reserva)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: self::asunto($this->reserva),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.reserva-confirmada',
        );
    }

    /** El asunto también se guarda en email_logs, por eso se calcula aquí. */
    public static function asunto(TalkUser $reserva): string
    {
        return "Reserva confirmada {$reserva->reference} - {$reserva->talk->title}";
    }
}
