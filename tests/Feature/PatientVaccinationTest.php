<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Unit;
use App\Models\User;
use App\Models\Vaccine;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PatientVaccinationTest extends TestCase
{
    use RefreshDatabase;

    private Unit $unit;

    protected function setUp(): void
    {
        parent::setUp();

        $this->unit = Unit::create(['name' => 'ml']);
    }

    private function makeVaccine(): Vaccine
    {
        $vaccine = Vaccine::create(['name' => 'Penta', 'created_by' => null]);
        $vaccine->ageRules()->create([
            'min_age' => 0,
            'min_age_unit' => 'day',
            'max_age' => 2,
            'max_age_unit' => 'year',
            'dose_rules' => [
                ['amount' => 1, 'amount_unit_id' => $this->unit->id],
                [
                    'amount' => 1,
                    'amount_unit_id' => $this->unit->id,
                    'interval_from_previous_dose' => 30,
                    'interval_from_previous_dose_unit' => 'day',
                ],
            ],
        ]);

        return $vaccine;
    }

    private function makePatient(string $dateOfBirth): Patient
    {
        return Patient::create([
            'khmer_first_name' => 'សុខ',
            'khmer_last_name' => 'ចាន់',
            'date_of_birth' => $dateOfBirth,
            'phone_number' => '0123456789',
            'gender' => 'male',
        ]);
    }

    public function test_first_dose_is_due_today_when_patient_is_in_age_range(): void
    {
        $patient = $this->makePatient(now()->subMonths(6)->toDateString());
        $vaccine = $this->makeVaccine();

        $status = $patient->nextDoseForVaccine($vaccine);

        $this->assertTrue($status['eligible']);
        $this->assertSame(0, $status['doses_completed']);
        $this->assertSame(2, $status['total_doses']);
        $this->assertSame(1, $status['next_dose_number']);
        $this->assertSame(now()->toDateString(), $status['next_dose_due_date']);
    }

    public function test_patient_outside_age_range_is_not_eligible(): void
    {
        $patient = $this->makePatient(now()->subYears(5)->toDateString());
        $vaccine = $this->makeVaccine();

        $status = $patient->nextDoseForVaccine($vaccine);

        $this->assertFalse($status['eligible']);
        $this->assertSame(0, $status['total_doses']);
        $this->assertNull($status['next_dose_number']);
        $this->assertNull($status['next_dose_due_date']);
    }

    public function test_second_dose_due_date_uses_interval_from_previous_dose(): void
    {
        $user = User::factory()->create();
        $patient = $this->makePatient(now()->subMonths(6)->toDateString());
        $vaccine = $this->makeVaccine();

        $patient->vaccinations()->create([
            'vaccine_id' => $vaccine->id,
            'dose_number' => 1,
            'administered_date' => '2026-09-01',
            'administered_by' => $user->id,
        ]);

        $status = $patient->nextDoseForVaccine($vaccine);

        $this->assertTrue($status['eligible']);
        $this->assertSame(1, $status['doses_completed']);
        $this->assertSame(2, $status['next_dose_number']);
        $this->assertSame(Carbon::parse('2026-09-01')->addDays(30)->toDateString(), $status['next_dose_due_date']);
    }

    public function test_all_doses_completed_has_no_next_dose(): void
    {
        $user = User::factory()->create();
        $patient = $this->makePatient(now()->subMonths(6)->toDateString());
        $vaccine = $this->makeVaccine();

        foreach ([1, 2] as $doseNumber) {
            $patient->vaccinations()->create([
                'vaccine_id' => $vaccine->id,
                'dose_number' => $doseNumber,
                'administered_date' => '2026-09-01',
                'administered_by' => $user->id,
            ]);
        }

        $status = $patient->nextDoseForVaccine($vaccine);

        $this->assertTrue($status['eligible']);
        $this->assertSame(2, $status['doses_completed']);
        $this->assertSame(2, $status['total_doses']);
        $this->assertNull($status['next_dose_number']);
        $this->assertNull($status['next_dose_due_date']);
    }

    public function test_store_creates_follow_up_appointment_for_next_dose(): void
    {
        $user = User::factory()->create();
        $patient = $this->makePatient(now()->subMonths(6)->toDateString());
        $vaccine = $this->makeVaccine();

        $response = $this->actingAs($user)->post("/patients/{$patient->id}/vaccinations", [
            'vaccine_id' => $vaccine->id,
            'dose_number' => 1,
            'administered_date' => now()->toDateString(),
            'notes' => null,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseCount('patient_vaccinations', 1);
        $this->assertDatabaseHas('appointments', [
            'patient_id' => $patient->id,
            'type' => 'vaccination',
            'status' => 'scheduled',
        ]);

        $appointment = Appointment::where('patient_id', $patient->id)->sole();
        $this->assertSame(now()->addDays(30)->toDateString(), Carbon::parse($appointment->appointment_date)->toDateString());
    }

    public function test_store_rejects_dose_number_beyond_total_doses(): void
    {
        $user = User::factory()->create();
        $patient = $this->makePatient(now()->subMonths(6)->toDateString());
        $vaccine = $this->makeVaccine();

        $response = $this->actingAs($user)->post("/patients/{$patient->id}/vaccinations", [
            'vaccine_id' => $vaccine->id,
            'dose_number' => 3,
            'administered_date' => now()->toDateString(),
            'notes' => null,
        ]);

        $response->assertSessionHasErrors('dose_number');
        $this->assertDatabaseCount('patient_vaccinations', 0);
    }

    public function test_store_rejects_dose_number_lower_than_recorded(): void
    {
        $user = User::factory()->create();
        $patient = $this->makePatient(now()->subMonths(6)->toDateString());
        $vaccine = $this->makeVaccine();

        foreach ([1, 2] as $doseNumber) {
            $patient->vaccinations()->create([
                'vaccine_id' => $vaccine->id,
                'dose_number' => $doseNumber,
                'administered_date' => '2026-09-01',
                'administered_by' => $user->id,
            ]);
        }

        $response = $this->actingAs($user)->post("/patients/{$patient->id}/vaccinations", [
            'vaccine_id' => $vaccine->id,
            'dose_number' => 1,
            'administered_date' => now()->toDateString(),
            'notes' => null,
        ]);

        $response->assertSessionHasErrors('dose_number');
        $this->assertDatabaseCount('patient_vaccinations', 2);
    }

    public function test_update_allows_saving_own_highest_dose(): void
    {
        $user = User::factory()->create();
        $patient = $this->makePatient(now()->subMonths(6)->toDateString());
        $vaccine = $this->makeVaccine();

        $doseTwo = null;
        foreach ([1, 2] as $doseNumber) {
            $doseTwo = $patient->vaccinations()->create([
                'vaccine_id' => $vaccine->id,
                'dose_number' => $doseNumber,
                'administered_date' => '2026-09-01',
                'administered_by' => $user->id,
            ]);
        }

        $response = $this->actingAs($user)->put(
            "/patients/{$patient->id}/vaccinations/{$doseTwo->id}",
            [
                'vaccine_id' => $vaccine->id,
                'dose_number' => 2,
                'administered_date' => '2026-09-01',
                'notes' => 'boosted',
            ]
        );

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('patient_vaccinations', ['id' => $doseTwo->id, 'notes' => 'boosted']);
    }

    public function test_update_rejects_dose_number_beyond_total_doses(): void
    {
        $user = User::factory()->create();
        $patient = $this->makePatient(now()->subMonths(6)->toDateString());
        $vaccine = $this->makeVaccine();

        $vaccination = $patient->vaccinations()->create([
            'vaccine_id' => $vaccine->id,
            'dose_number' => 1,
            'administered_date' => '2026-09-01',
            'administered_by' => $user->id,
        ]);

        $response = $this->actingAs($user)->put(
            "/patients/{$patient->id}/vaccinations/{$vaccination->id}",
            [
                'vaccine_id' => $vaccine->id,
                'dose_number' => 9,
                'administered_date' => '2026-09-01',
                'notes' => null,
            ]
        );

        $response->assertSessionHasErrors('dose_number');
    }
}
