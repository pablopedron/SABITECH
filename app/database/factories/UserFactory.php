<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('Sabitech2026!'),
            'is_active' => 1,
            'zip_code' => fake()->numerify('#####'),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => 0]);
    }
}
