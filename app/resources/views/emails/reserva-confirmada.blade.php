<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reserva confirmada</title>
</head>
<body style="font-family: Arial, sans-serif; color: #000000;">
    <h1 style="font-size: 20px;">Tu reserva en SABITECH está confirmada</h1>

    <p>Hola {{ $reserva->user->name }}:</p>

    <p>Tienes una plaza reservada en esta charla:</p>

    <ul>
        <li><strong>Charla:</strong> {{ $reserva->talk->title }}</li>
        <li><strong>Fecha:</strong> {{ $reserva->talk->starts_at->format('d/m/Y') }}</li>
        <li><strong>Horario:</strong> {{ $reserva->talk->starts_at->format('H:i') }} - {{ $reserva->talk->ends_at->format('H:i') }}</li>
        <li><strong>Lugar:</strong> {{ $reserva->talk->location->name }} ({{ $reserva->talk->location->address }})</li>
        <li><strong>Referencia de la reserva:</strong> {{ $reserva->reference }}</li>
    </ul>

    <p>
        Este correo solo confirma tu plaza; no registra tu asistencia.
        El día de la charla abre tu acreditación en la web y enseña el código QR en la entrada.
    </p>

    <p>Si no puedes asistir, cancela la reserva desde "Mi cuenta" para liberar la plaza.</p>

    <p>SABITECH WEB · PGD Technologies S.L.</p>
</body>
</html>
