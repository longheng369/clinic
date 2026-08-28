<?php

namespace App\Helpers;

use App\Models\Gazetteer;
use Illuminate\Support\Str;

class GazetteerHelper
{
    public static function getGazetteer(?string $gazetteerCode): array
    {
        if ($gazetteerCode === null || $gazetteerCode === '') {
            return [
                'province' => null,
                'district' => null,
                'commune' => null,
                'village' => null,
            ];
        }

        $code = (string) $gazetteerCode;
        $isEvenLength = Str::length($code) % 2 === 0;

        $parts = $isEvenLength
            ? str_split($code, 2)
            : array_merge([substr($code, 0, 1)], str_split(substr($code, 1), 2));

        return [
            'province' => Gazetteer::where('code', $parts[0] ?? null)->first(),
            'district' => Gazetteer::where('code', ($parts[0] ?? '') . ($parts[1] ?? ''))->first(),
            'commune' => Gazetteer::where('code', ($parts[0] ?? '') . ($parts[1] ?? '') . ($parts[2] ?? ''))->first(),
            'village' => Gazetteer::where('code', ($parts[0] ?? '') . ($parts[1] ?? '') . ($parts[2] ?? '') . ($parts[3] ?? ''))->first(),
        ];
    }
}
