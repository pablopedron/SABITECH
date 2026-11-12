<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\CreaDatos;
use Tests\TestCase;

/** Pruebas de autenticación: registro, login, perfil y cierre de sesión. */
class AuthTest extends TestCase
{
    use CreaDatos, RefreshDatabase;

    private function datosRegistro(array $extra = []): array
    {
        return array_merge([
            'name' => 'Persona Nueva',
            'email' => 'nueva@sabitech.test',
            'password' => 'Sabitech2026!',
            'zip_code' => '28001',
        ], $extra);
    }

    // ---------------------------------------------------------------- registro

    public function test_un_usuario_nuevo_se_registra_como_asistente_y_recibe_token(): void
    {
        $this->postJson('/api/register', $this->datosRegistro())
            ->assertCreated()
            ->assertJsonPath('user.email', 'nueva@sabitech.test')
            ->assertJsonPath('user.roles', ['asistente'])
            ->assertJsonStructure(['user' => ['id', 'name', 'email', 'roles'], 'token']);

        $usuario = User::where('email', 'nueva@sabitech.test')->firstOrFail();
        // La contraseña nunca se guarda en claro
        $this->assertNotSame('Sabitech2026!', $usuario->password);
        $this->assertTrue(password_verify('Sabitech2026!', $usuario->password));
    }

    public function test_no_se_puede_registrar_un_email_repetido(): void
    {
        $this->usuario('asistente', ['email' => 'nueva@sabitech.test']);

        $this->postJson('/api/register', $this->datosRegistro())
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_el_registro_valida_contrasena_y_codigo_postal(): void
    {
        $this->postJson('/api/register', $this->datosRegistro(['password' => 'corta']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('password');

        $this->postJson('/api/register', $this->datosRegistro(['zip_code' => '1234']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('zip_code');

        $this->assertDatabaseCount('users', 0);
    }

    public function test_las_necesidades_de_accesibilidad_solo_se_guardan_con_consentimiento(): void
    {
        $this->postJson('/api/register', $this->datosRegistro(['accessibility_needs' => 'Movilidad reducida']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('accessibility_consent');

        $this->postJson('/api/register', $this->datosRegistro([
            'accessibility_needs' => 'Movilidad reducida',
            'accessibility_consent' => true,
        ]))->assertCreated();

        $this->assertNotNull(
            DB::table('users')->where('email', 'nueva@sabitech.test')->value('accessibility_consent_at')
        );
    }

    // ---------------------------------------------------------------- login

    public function test_login_correcto_devuelve_token(): void
    {
        $this->usuario('asistente', ['email' => 'ana@sabitech.test']);

        $this->postJson('/api/login', ['email' => 'ana@sabitech.test', 'password' => 'Sabitech2026!'])
            ->assertOk()
            ->assertJsonStructure(['user' => ['id', 'name', 'email', 'roles'], 'token']);
    }

    public function test_login_con_credenciales_malas_o_usuario_inactivo_da_el_mismo_401(): void
    {
        $this->usuario('asistente', ['email' => 'ana@sabitech.test']);
        $this->usuario('asistente', ['email' => 'fabio@sabitech.test', 'is_active' => 0]);

        $casos = [
            ['ana@sabitech.test', 'contraseña-mala'],      // contraseña incorrecta
            ['nadie@sabitech.test', 'Sabitech2026!'],       // email que no existe
            ['fabio@sabitech.test', 'Sabitech2026!'],       // usuario inactivo
        ];

        foreach ($casos as [$email, $password]) {
            $this->postJson('/api/login', ['email' => $email, 'password' => $password])
                ->assertUnauthorized()
                ->assertExactJson(['message' => 'Credenciales incorrectas.']);
        }
    }

    // ---------------------------------------------------------------- perfil y logout

    public function test_el_perfil_exige_sesion_y_devuelve_los_datos_del_usuario(): void
    {
        $this->getJson('/api/me')->assertUnauthorized();

        $usuario = $this->usuario('asistente', ['zip_code' => '28010']);
        Sanctum::actingAs($usuario);

        $this->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('email', $usuario->email)
            ->assertJsonPath('zip_code', '28010');
    }

    public function test_cerrar_sesion_revoca_el_token(): void
    {
        $this->usuario('asistente', ['email' => 'ana@sabitech.test']);
        $token = $this->postJson('/api/login', ['email' => 'ana@sabitech.test', 'password' => 'Sabitech2026!'])
            ->assertOk()
            ->json('token');
        $this->assertDatabaseCount('personal_access_tokens', 1);

        $this->withToken($token)->postJson('/api/logout')->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
