<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use Illuminate\Http\Request;

class VisitBillingController extends Controller
{
    public function show(Visit $visit)
    {
        $summary = $visit->billingSummary();

        return back()->with('billingData', array_merge($summary, [
            'visit_id' => $visit->id,
        ]));
    }

    public function update(Request $request, Visit $visit)
    {
        $validated = $request->validate([
            'paid_amount' => ['nullable', 'numeric', 'min:0'],
            'payment_status' => ['nullable', 'string', 'in:Unpaid,Partial,Paid'],
        ]);

        $summary = $visit->billingSummary();
        $fee = $summary['fee'];
        $paidAmount = $validated['paid_amount'] ?? $visit->paid_amount;

        if ($paidAmount >= $fee && $fee > 0) {
            $validated['payment_status'] = 'Paid';
        } elseif ($paidAmount > 0 && $paidAmount < $fee) {
            $validated['payment_status'] = 'Partial';
        } elseif ($paidAmount <= 0 && isset($validated['payment_status'])) {
            // keep the explicit status if set
        }

        $visit->update([
            'fee' => $fee,
            'paid_amount' => $paidAmount,
            'payment_status' => $validated['payment_status'] ?? $visit->payment_status,
            'payment_date' => $paidAmount > 0 ? now() : $visit->payment_date,
        ]);

        return back()->with('success', 'Billing updated.');
    }
}
