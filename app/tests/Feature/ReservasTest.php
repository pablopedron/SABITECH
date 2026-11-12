<?php

namespace Tests\Feature;

use App\Models\Talk;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Pruebas mínimas del checkpoint (semana 5 del enunciado):
 * reserva válida, reserva repetida, charla sin plazas y que la reserva queda guardada.
 */
class ReservasTest extends TestCase
{
    use RefreshDatabase;

    /** Asistente nuevo (el rol "asistente" ya lo crea la migración). */
    private function asistente(): User
    {
        $usuario = User::factory()->create();
        DB::table('role_user')->insert([
            'user_id' => $usuario->id,
            'role_id' => DB::table('roles')->where('name', 'asistente')->value('id'),
        ]);

        return $usuario;
    }

    /** Charla publicada dentro de 10 días. */
    private function charla(int $capacidad, int $ocupadas = 0): Talk
    {
        $sala = DB::table('locations')->insertGetId([
            'name' => 'Sala de prueba', 'address' => 'Calle de Prueba 1', 'room_capacity' => 50,
        ]);
        $categoria = DB::table('categories')->insertGetId(['name' => 'Categoría de prueba']);

        $id = DB::table('talks')->insertGetId([
            'location_id' => $sala,
            'created_by' => $this->asistente()->id,
            'category_id' => $categoria,
            'title' => 'Charla de prueba',
            'speaker_name' => 'Ponente de Prueba',
            'starts_at' => now()->addDays(10),
            'ends_at' => now()->addDays(10)->addHour(),
            'capacity' => $capacidad,
            'seats_taken' => $ocupadas,
            'is_published' => 1,
        ]);

        return Talk::findOrFail($id);
    }

    private function plazasOcupadas(Talk $charla): int
    {
        return (int) DB::table('talks')->where('id', $charla->id)->value('seats_taken');
    }

    public function test_reserva_valida(): void
    {
        $usuario = $this->asistente();
        $charla = $this->charla(10);

        Sanctum::actingAs($usuario);
        $this->postJson("/api/talks/{$charla->id}/inscribe")
            ->assertCreated()
            ->assertJsonPath('data.status', 'confirmada');

        $this->assertDatabaseHas('talk_user', [
            'user_id' => $usuario->id, 'talk_id' => $charla->id, 'status' => 'confirmada',
        ]);
        $this->assertSame(1, $this->plazasOcupadas($charla));
    }

    public function test_reserva_repetida_da_409(): void
    {
        $usuario = $this->asistente();
        $charla = $this->charla(10);

        Sanctum::actingAs($usuario);
        $this->postJson("/api/talks/{$charla->id}/inscribe")->assertCreated();
        $this->postJson("/api/talks/{$charla->id}/inscribe")->assertStatus(409);

        $this->assertSame(1, $this->plazasOcupadas($charla));
    }

    public function test_charla_sin_plazas_da_409(): void
    {
        $charla = $this->charla(2, 2);

        Sanctum::actingAs($this->asistente());
        $this->postJson("/api/talks/{$charla->id}/inscribe")->assertStatus(409);

        $this->assertSame(2, $this->plazasOcupadas($charla));
        $this->assertDatabaseCount('talk_user', 0);
    }

    public function test_la_reserva_sigue_guardada_al_volver_a_consultar(): void
    {
        $usuario = $this->asistente();
        $charla = $this->charla(10);

        Sanctum::actingAs($usuario);
        $this->postJson("/api/talks/{$charla->id}/inscribe")->assertCreated();

        // Nueva consulta de "mis reservas": la reserva viene de la base de datos
        $this->getJson('/api/me/reservations')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.talk.id', $charla->id);
    }
}
