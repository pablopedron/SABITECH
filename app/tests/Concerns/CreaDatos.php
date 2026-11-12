<?php

namespace Tests\Concerns;

use App\Models\Talk;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Ayudas para crear datos de prueba. Los roles ya los crea la migración (no hay que sembrarlos).
 */
trait CreaDatos
{
    /** Usuario con un rol (asistente, organizacion o personal_acceso). */
    protected function usuario(string $rol = 'asistente', array $extra = []): User
    {
        $usuario = User::factory()->create($extra);

        DB::table('role_user')->insert([
            'user_id' => $usuario->id,
            'role_id' => DB::table('roles')->where('name', $rol)->value('id'),
        ]);

        return $usuario;
    }

    protected function sala(int $capacidad = 50): int
    {
        return DB::table('locations')->insertGetId([
            'name' => 'Sala '.Str::random(6),
            'address' => 'Calle de Prueba 1',
            'room_capacity' => $capacidad,
        ]);
    }

    protected function categoria(): int
    {
        return DB::table('categories')->insertGetId(['name' => 'Categoría '.Str::random(6)]);
    }

    /** Charla publicada, dentro de 10 días y con 10 plazas. $extra pisa cualquier columna. */
    protected function charla(array $extra = []): Talk
    {
        $capacidad = $extra['capacity'] ?? 10;

        $id = DB::table('talks')->insertGetId(array_merge([
            'location_id' => $this->sala(max($capacidad, 50)),
            'created_by' => $this->usuario('organizacion')->id,
            'category_id' => $this->categoria(),
            'title' => 'Charla de prueba',
            'speaker_name' => 'Ponente de Prueba',
            'starts_at' => now()->addDays(10),
            'ends_at' => now()->addDays(10)->addHour(),
            'capacity' => $capacidad,
            'seats_taken' => 0,
            'is_published' => 1,
        ], $extra));

        return Talk::findOrFail($id);
    }

    /** Charla que ya ha empezado (empezó hace una hora y termina dentro de otra). */
    protected function charlaEmpezada(array $extra = []): Talk
    {
        return $this->charla(array_merge([
            'starts_at' => now()->subHour(),
            'ends_at' => now()->addHour(),
        ], $extra));
    }

    /** Inserta una reserva directamente en la base de datos (sin pasar por la API). Devuelve su id. */
    protected function reserva(User $usuario, Talk $charla, array $extra = []): int
    {
        return DB::table('talk_user')->insertGetId(array_merge([
            'reference' => 'SBT-'.strtoupper(Str::random(6)),
            'user_id' => $usuario->id,
            'talk_id' => $charla->id,
            'status' => 'confirmada',
            'qr_secret' => bin2hex(random_bytes(32)),
        ], $extra));
    }

    protected function plazasOcupadas(Talk $charla): int
    {
        return (int) DB::table('talks')->where('id', $charla->id)->value('seats_taken');
    }

    protected function reservasConfirmadas(Talk $charla): int
    {
        return DB::table('talk_user')->where('talk_id', $charla->id)->where('status', 'confirmada')->count();
    }
}
