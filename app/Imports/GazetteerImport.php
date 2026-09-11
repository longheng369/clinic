<?php

namespace App\Imports;

use App\Models\Gazetteer;
use Maatwebsite\Excel\Concerns\ToModel;

class GazetteerImport implements ToModel
{
    /**
     * @param  array<int, mixed>  $row
     */
    public function model(array $row): ?Gazetteer
    {
        return Gazetteer::firstOrCreate(
            [
                'code' => $row[1],
            ],
            [
                'type' => $row[0],
                'name_in_khmer' => $row[2],
                'name_in_latin' => $row[3],
            ],
        );
    }
}
