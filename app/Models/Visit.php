<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'patient_id',
    'type',
    'status',
    'created_by',
    'subtotal',
    'total_amount',
    'paid_amount',
    'payment_status',
    'payment_date',
])]
class Visit extends Model
{
    protected function casts(): array
    {
        return [
            'visit_date' => 'datetime',
            'payment_date' => 'datetime',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function consultations(): HasMany
    {
        return $this->hasMany(Consultation::class);
    }

    public function paraclinicRequests(): HasMany
    {
        return $this->hasMany(ParaclinicRequest::class);
    }

    public function surveillance(): HasMany
    {
        return $this->hasMany(PatientSurveillance::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(PatientAttachment::class);
    }

    public function medicationOrders(): HasMany
    {
        return $this->hasMany(MedicationOrder::class);
    }

    public function prescriptions(): HasMany
    {
        return $this->hasMany(Prescription::class);
    }

    public function billingSummary(): array
    {
        $consultationsTotal = $this->consultations()->sum('fee');

        $medicationsTotal = MedicationAdministration::query()
            ->whereHas('medicationOrder', fn ($q) => $q->where('visit_id', $this->id))
            ->where('status', 'provided')
            ->sum('unit_price');

        $paraclinicTotal = $this->paraclinicRequests()->sum('total_amount');

        $subtotal = $consultationsTotal + $medicationsTotal + $paraclinicTotal;
        $total = $subtotal;
        $paidAmount = (float) $this->paid_amount;
        $balance = $total - $paidAmount;

        return [
            'consultation_fees' => (float) $consultationsTotal,
            'medication_costs' => (float) $medicationsTotal,
            'paraclinic_costs' => (float) $paraclinicTotal,
            'subtotal' => $subtotal,
            'total_amount' => $total,
            'paid_amount' => $paidAmount,
            'balance' => $balance,
            'payment_status' => $this->payment_status,
            'payment_date' => $this->payment_date?->toISOString(),
        ];
    }
}
