<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gazetteer extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'type',
        'code',
        'name_in_khmer',
        'name_in_latin',
    ];
}
