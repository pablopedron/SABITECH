<?php

namespace App\Services;

use App\Models\TalkUser;

/**
 * Token del QR de asistencia (prototipo del checkpoint).
 *
 * Cómo funciona:
 * - El tiempo se divide en ventanas de 30 segundos: ventana = segundos desde 1970 / 30.
 * - Token = "idReserva.ventana.firma", con firma = HMAC-SHA256("idReserva.ventana", qr_secret).
 * - qr_secret es distinto en cada reserva y nunca sale del servidor, así que nadie puede
 *   fabricar ni modificar un token sin que la firma deje de coincidir.
 * - El token no se guarda en la base de datos: el servidor lo vuelve a calcular para comprobarlo.
 * - El reloj que manda es el del SERVIDOR, nunca la hora del navegador.
 *
 * Tolerancia: un token de la ventana anterior se acepta solo durante los 5 primeros
 * segundos de la ventana nueva (para un escaneo justo en el cambio). Como máximo, un
 * código vale 35 segundos.
 */
class QrToken
{
    public const SEGUNDOS_VENTANA = 30;

    public const TOLERANCIA_SEGUNDOS = 5;

    public function ventanaActual(): int
    {
        return intdiv(now()->timestamp, self::SEGUNDOS_VENTANA);
    }

    /** Segundos que quedan hasta que cambie el código. */
    public function segundosRestantes(): int
    {
        return self::SEGUNDOS_VENTANA - (now()->timestamp % self::SEGUNDOS_VENTANA);
    }

    public function generar(TalkUser $reserva, ?int $ventana = null): string
    {
        $ventana ??= $this->ventanaActual();

        return "{$reserva->id}.{$ventana}.".$this->firma($reserva, $ventana);
    }

    /**
     * Comprueba un token escaneado. Devuelve [reserva, ventana] si es válido.
     * Si no lo es, corta la petición con 422 y un mensaje comprensible.
     *
     * @return array{0: TalkUser, 1: int}
     */
    public function comprobar(string $token): array
    {
        if (! preg_match('/^(\d+)\.(\d+)\.([0-9a-f]{64})$/', $token, $partes)) {
            abort(422, 'Código QR no válido.');
        }

        [, $reservaId, $ventana, $firma] = $partes;
        $ventana = (int) $ventana;

        $reserva = TalkUser::find($reservaId);

        // Firma incorrecta = código manipulado o inventado (mismo mensaje que reserva inexistente)
        if (! $reserva || ! hash_equals($this->firma($reserva, $ventana), $firma)) {
            abort(422, 'Código QR no válido.');
        }

        $actual = $this->ventanaActual();
        $enTolerancia = $ventana === $actual - 1
            && now()->timestamp % self::SEGUNDOS_VENTANA < self::TOLERANCIA_SEGUNDOS;

        if ($ventana !== $actual && ! $enTolerancia) {
            abort(422, 'Código QR caducado. Pide a la persona que muestre el código actual.');
        }

        if ($reserva->status !== 'confirmada') {
            abort(422, 'La reserva de este código no está confirmada.');
        }

        return [$reserva, $ventana];
    }

    private function firma(TalkUser $reserva, int $ventana): string
    {
        return hash_hmac('sha256', "{$reserva->id}.{$ventana}", $reserva->qr_secret);
    }
}
