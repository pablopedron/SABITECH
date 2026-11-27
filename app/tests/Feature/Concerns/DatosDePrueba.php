<?php

namespace Tests\Feature\Concerns;

use App\Models\Talk;
use App\Models\TalkUser;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;

/**
 * Ayudantes para crear usuarios, charlas y reservas en los tests.
 * Los roles (asistente, organizacion, personal_acceso) ya los crea la migración.
 */
trait DatosDePrueba
{
    protected function usuarioConRol(string $rol): User
    {
        $usuario = User::factory()->create();
        DB::table('role_user')->insert([
            'user_id' => $usuario->id,
            'role_id' => DB::table('roles')->where('name', $rol)->value('id'),
        ]);

        return $usuario;
    }

    /** Charla publicada dentro de 10 días. */
    protected function nuevaCharla(int $capacidad = 10): Talk
    {
        $sala = DB::table('locations')->insertGetId([
            'name' => 'Sala de prueba', 'address' => 'Calle de Prueba 1', 'room_capacity' => 50,
        ]);
        $categoria = DB::table('categories')->insertGetId(['name' => 'Categoría '.uniqid()]);

        $id = DB::table('talks')->insertGetId([
            'location_id' => $sala,
            'created_by' => $this->usuarioConRol('organizacion')->id,
            'category_id' => $categoria,
            'title' => 'Charla de prueba',
            'speaker_name' => 'Ponente de Prueba',
            'starts_at' => now()->addDays(10),
            'ends_at' => now()->addDays(10)->addHour(),
            'capacity' => $capacidad,
            'seats_taken' => 0,
            'is_published' => 1,
        ]);

        return Talk::findOrFail($id);
    }

    /** Reserva hecha a través de la API, como lo haría el frontend. */
    protected function reservarComo(User $usuario, Talk $charla): TalkUser
    {
        Sanctum::actingAs($usuario);
        $id = $this->postJson("/api/talks/{$charla->id}/inscribe")->assertCreated()->json('data.id');

        return TalkUser::findOrFail($id);
    }
}
