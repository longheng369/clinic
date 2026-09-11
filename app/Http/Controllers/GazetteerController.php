<?php

namespace App\Http\Controllers;

use App\Models\Gazetteer;
use Illuminate\Http\JsonResponse;

class GazetteerController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Gazetteer::all(),
        ]);
    }

    public function getProvinceAndCapitalCity(): JsonResponse
    {
        return response()->json([
            'data' => Gazetteer::where('type', 'ខេត្ត')
                ->orWhere('type', 'រាជធានី')
                ->get(),
        ]);
    }

    public function getDistrictByProvince(string $province_code): JsonResponse
    {
        $provinceLength = strlen($province_code);

        return response()->json([
            'data' => Gazetteer::where(function ($query) {
                $query->where('type', 'ស្រុក')
                    ->orWhere('type', 'ខណ្ឌ')
                    ->orWhere('type', 'ក្រុង');
            })
                ->where('code', 'like', $province_code . '%')
                ->whereRaw('LENGTH(code) = ?', [$provinceLength + 2])
                ->get(),
        ]);
    }

    public function getCommuneByDistrict(string $district_code): JsonResponse
    {
        $districtLength = strlen($district_code);

        return response()->json([
            'data' => Gazetteer::where(function ($query) {
                $query->where('type', 'ឃុំ')
                    ->orWhere('type', 'សង្កាត់');
            })
                ->where('code', 'like', $district_code . '%')
                ->whereRaw('LENGTH(code) = ?', [$districtLength + 2])
                ->get(),
        ]);
    }

    public function getVillageByCommune(string $commune_code): JsonResponse
    {
        $communeLength = strlen($commune_code);

        return response()->json([
            'data' => Gazetteer::where('type', 'ភូមិ')
                ->where('code', 'like', $commune_code . '%')
                ->whereRaw('LENGTH(code) = ?', [$communeLength + 2])
                ->get(),
        ]);
    }
}
