<?php

namespace App\Models;

use Database\Factories\MedicationRouteFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['code', 'name', 'description'])]
class MedicationRoute extends Model
{
    /** @use HasFactory<MedicationRouteFactory> */
    use HasFactory;
}
