<?php
// Comprobación mínima backend + base de datos (sustituir por el framework PHP elegido).
header('Content-Type: application/json; charset=utf-8');

$dbStatus = 'ok';
try {
    new PDO(
        sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            getenv('DB_HOST'), getenv('DB_PORT'), getenv('DB_NAME')),
        getenv('DB_USER'),
        getenv('DB_PASSWORD'),
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    $dbStatus = 'error de conexión';
}

echo json_encode(['status' => 'ok', 'service' => 'sabitech-web', 'database' => $dbStatus]);
