<?php

// CORS: permite que el frontend React (Vite, puerto 5173) llame a la API.
// En producción se define FRONTEND_URL en el .env.
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => array_filter(explode(',', env(
        'CORS_ALLOWED_ORIGINS',
        'http://localhost:5173,http://127.0.0.1:5173'
    ))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    // Autenticación por token Bearer: no se usan cookies
    'supports_credentials' => false,
];
