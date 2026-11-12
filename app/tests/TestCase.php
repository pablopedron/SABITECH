<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Seguro anti-desastres: los tests borran y recrean las tablas (RefreshDatabase),
     * así que solo se permiten sobre una base de datos cuyo nombre termine en "_test".
     * Se comprueba al crear la aplicación, antes de que se toque ninguna tabla.
     */
    public function createApplication()
    {
        $app = parent::createApplication();

        $conexion = $app['config']->get('database.default');
        $base = (string) $app['config']->get("database.connections.{$conexion}.database");

        if (! str_ends_with($base, '_test')) {
            throw new \RuntimeException(
                "Los tests solo pueden usar una base de datos que termine en _test (ahora: '{$base}'). "
                .'Así no se borra la base de datos de desarrollo.'
            );
        }

        return $app;
    }
}
