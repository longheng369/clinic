<?php

namespace Tests\Feature;

use App\Models\Unit;
use App\Models\User;
use App\Models\Vaccine;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VaccineValidationTest extends TestCase
{
    use RefreshDatabase;

    private Unit $unit;

    protected function setUp(): void
    {
        parent::setUp();

        $this->unit = Unit::create(['name' => 'ml']);
    }

    private function validPayload(array $overrides = []): array
    {
        return array_replace_recursive([
            'name' => 'BCG',
            'description' => 'Bacillus Calmette-Guerin',
            'age_rules' => [
                [
                    'min_age' => 0,
                    'min_age_unit' => 'day',
                    'max_age' => null,
                    'max_age_unit' => 'day',
                    'dose_rules' => [
                        ['amount' => 1, 'amount_unit_id' => $this->unit->id],
                    ],
                ],
            ],
        ], $overrides);
    }

    public function test_store_requires_at_least_one_age_rule(): void
    {
        $payload = $this->validPayload();
        $payload['age_rules'] = [];

        $response = $this->actingAs(User::factory()->create())
            ->post('/vaccines', $payload);

        $response->assertSessionHasErrors(['age_rules']);
    }

    public function test_store_rejects_duplicate_name(): void
    {
        Vaccine::create(['name' => 'BCG', 'created_by' => null]);

        $response = $this->actingAs(User::factory()->create())
            ->post('/vaccines', $this->validPayload());

        $response->assertSessionHasErrors(['name']);
    }

    public function test_store_rejects_non_positive_amount(): void
    {
        $response = $this->actingAs(User::factory()->create())
            ->post('/vaccines', $this->validPayload([
                'age_rules' => [
                    ['dose_rules' => [['amount' => 0]]],
                ],
            ]));

        $response->assertSessionHasErrors(['age_rules.0.dose_rules.0.amount']);
    }

    public function test_store_requires_interval_on_follow_up_doses(): void
    {
        $response = $this->actingAs(User::factory()->create())
            ->post('/vaccines', $this->validPayload([
                'age_rules' => [
                    ['dose_rules' => [
                        ['amount' => 1],
                        ['amount' => 1],
                    ]],
                ],
            ]));

        $response->assertSessionHasErrors([
            'age_rules.0.dose_rules.1.interval_from_previous_dose',
            'age_rules.0.dose_rules.1.interval_from_previous_dose_unit',
        ]);
    }

    public function test_store_rejects_max_age_below_min_age_across_units(): void
    {
        $response = $this->actingAs(User::factory()->create())
            ->post('/vaccines', $this->validPayload([
                'age_rules' => [
                    [
                        'min_age' => 1,
                        'min_age_unit' => 'month',
                        'max_age' => 20,
                        'max_age_unit' => 'day',
                    ],
                ],
            ]));

        $response->assertSessionHasErrors(['age_rules.0.max_age']);
    }

    public function test_store_requires_max_age_unit_when_max_age_set(): void
    {
        $response = $this->actingAs(User::factory()->create())
            ->post('/vaccines', $this->validPayload([
                'age_rules' => [
                    ['max_age' => 10, 'max_age_unit' => null],
                ],
            ]));

        $response->assertSessionHasErrors(['age_rules.0.max_age_unit']);
    }

    public function test_store_accepts_valid_payload(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/vaccines', $this->validPayload());

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('vaccines', ['name' => 'BCG']);
        $this->assertDatabaseCount('vaccine_age_rules', 1);
    }

    public function test_update_rejects_age_rule_owned_by_another_vaccine(): void
    {
        $user = User::factory()->create();
        $own = Vaccine::create(['name' => 'Own', 'created_by' => $user->id]);
        $other = Vaccine::create(['name' => 'Other', 'created_by' => $user->id]);
        $otherRule = $other->ageRules()->create([
            'min_age' => 0,
            'min_age_unit' => 'day',
            'max_age' => null,
            'max_age_unit' => 'day',
            'dose_rules' => [['amount' => 1, 'amount_unit_id' => $this->unit->id]],
        ]);

        $payload = $this->validPayload([
            'age_rules' => [
                ['id' => $otherRule->id],
            ],
        ]);

        $response = $this->actingAs($user)
            ->put("/vaccines/{$own->id}", $payload);

        $response->assertSessionHasErrors(['age_rules.0.id']);
    }

    public function test_update_keeps_own_name_and_own_age_rule(): void
    {
        $user = User::factory()->create();
        $vaccine = Vaccine::create(['name' => 'BCG', 'created_by' => $user->id]);
        $rule = $vaccine->ageRules()->create([
            'min_age' => 0,
            'min_age_unit' => 'day',
            'max_age' => null,
            'max_age_unit' => 'day',
            'dose_rules' => [['amount' => 1, 'amount_unit_id' => $this->unit->id]],
        ]);

        $payload = $this->validPayload([
            'age_rules' => [
                ['id' => $rule->id, 'min_age' => 1],
            ],
        ]);

        $response = $this->actingAs($user)->put("/vaccines/{$vaccine->id}", $payload);

        $response->assertSessionHasNoErrors();
        $this->assertSame(1, $vaccine->ageRules()->count());
    }

    public function test_update_rejects_name_of_another_vaccine(): void
    {
        $user = User::factory()->create();
        $vaccine = Vaccine::create(['name' => 'Mine', 'created_by' => $user->id]);
        Vaccine::create(['name' => 'Taken', 'created_by' => $user->id]);

        $response = $this->actingAs($user)
            ->put("/vaccines/{$vaccine->id}", $this->validPayload(['name' => 'Taken']));

        $response->assertSessionHasErrors(['name']);
    }

    public function test_update_rejects_zero_amount(): void
    {
        $user = User::factory()->create();
        $vaccine = Vaccine::create(['name' => 'Mine', 'created_by' => $user->id]);

        $response = $this->actingAs($user)->put("/vaccines/{$vaccine->id}", $this->validPayload([
            'age_rules' => [
                ['dose_rules' => [['amount' => 0]]],
            ],
        ]));

        $response->assertSessionHasErrors(['age_rules.0.dose_rules.0.amount']);
    }
}
