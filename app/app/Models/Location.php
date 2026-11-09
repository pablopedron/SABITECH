<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    // La tabla locations no tiene created_at / updated_at
    public $timestamps = false;

    protected $fillable = ['name', 'address', 'room_capacity'];

    public function talks(): HasMany
    {
        return $this->hasMany(Talk::class);
    }
}
