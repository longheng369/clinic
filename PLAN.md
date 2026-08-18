# Visits + Medication Administration (Final)

## Data Model

```
visit (type: OPD/IPD, status: active/closed)
 ├── consultations (hasMany)
 ├── paraclinic_requests (hasMany)
 ├── patient_surveillances (hasMany)
 ├── patient_attachments (hasMany)
 └── medication_administrations (hasMany)
```

**Every consultation creates a visit.** Default type is `OPD`. If the doctor later decides the patient needs admission, the visit type is changed to `IPD` and subsequent consultations attach to the same visit. When the case is closed, `visit.status = closed` and a new visit will be created next time.

All records created during a visit scope to that visit via `visit_id`. This ties everything to the episode for billing, retrospective review, and continuity.

## Medication Lifecycle

Each "Provide" marks a **single dose** as administered — not a full day's course. So for TID the nurse clicks Provide three separate times throughout the day.

```
Prescribed (ordered, e.g. TID)
  → Provided (1st dose given)
  → Provided (2nd dose given)
  → Provided (3rd dose given)
  → Continue (next day — renews the order)
  → Provided → Provided → Provided
  → Continue → Provided → Provided → Provided
  → ... → Stop (discontinued)
```

### Statuses

| Status | Meaning | Available Actions |
|--------|---------|-------------------|
| **Prescribed** | Ordered but no dose given yet | Provide, Stop |
| **Provided** | Single dose given | Continue, Stop |
| **Continued** | Renewed for another interval cycle | Provide, Stop |
| **Stopped** | Discontinued permanently | *(none, read-only)* |

The `interval` field (QD/BID/TID/QID/QHS/PRN) is informational — it tells the nurse the expected frequency but doesn't enforce it. Each Provide is an independent log entry. Continue renews the order so the same medicine can enter a new Provide cycle. Stop ends it entirely.

## Steps

### 1. Create `visits` migration + model

**Columns:** `id`, `patient_id` (FK → patients, cascade), `type` (OPD/IPD, default OPD), `status` (active/closed, default active), `visit_date` (default now()), `recorded_by` (FK → users, nullOnDelete), timestamps.

**Model:** `app/Models/Visit.php` — relationships: `patient()`, `recordedBy()`, `consultations()`, `paraclinicRequests()`, `surveillance()`, `attachments()`, `medicationAdministrations()`

### 2. Add `visit_id` to all scoped tables (4 migrations)

| Migration | Table | Notes |
|-----------|-------|-------|
| `add_visit_id_to_consultations` | consultations | nullable FK, no unique |
| `add_visit_id_to_paraclinic_requests` | paraclinic_requests | nullable FK |
| `add_visit_id_to_patient_surveillances` | patient_surveillances | nullable FK |
| `add_visit_id_to_patient_attachments` | patient_attachments | nullable FK |

All nullable, `nullOnDelete`, no unique constraint.

### 3. Create `medication_administrations` table

**Columns:** `id`, `visit_id` (FK → visits, cascade), `medicine_id` (FK → medicines, nullOnDelete), `route`, `dosage` (decimal 8,2), `unit`, `interval`, `status` (prescribed/provided/continued/stopped, default prescribed), `notes` (nullable text), `created_by` (FK → users, nullOnDelete), timestamps.

**Per-dose tracking:** Each record tracks a single prescription line item. "Provide" logs one dose. The same record can be Provided → Continued → Provided → Continued multiple times (looping across days). "Continue" renews for another interval period. "Stop" terminates permanently.

**Model:** `app/Models/MedicationAdministration.php` — relationships: `visit()`, `medicine()`, `recordedBy()`, casts `dosage` to `decimal:2`.

### 4. Build Medication Tab frontend

**`medication.tsx`** — DataTable with: Medicine, Route, Dosage/Unit, Interval, Status badge, Recorded By, Actions (provide/continue/stop contextual). Follows surveillance tab pattern.

**`medicationForm.tsx`** — Modal form: medicine select, route, dosage, unit, interval (selects), notes (textarea). Matches `Input`/`Select` patterns.

### 5. Update controllers

**`ConsultationController@store()`:** auto-create a visit (`type: 'OPD'`), assign it to the consultation. Pass active IPD visits on `create()`.

**`ConsultationController@destroy()`:** close/delete visit if no more consultations.

**Surveillance, Paraclinic, Attachment controllers:** accept `visit_id` in their store methods. Pass `activeVisits` on their create/index views.

**`PatientController@show()`:** add `medicationAdministrations` (paginated, with medicine name) and `medicines` list. Also pass `activeVisits`.

### 6. Wire up `show.tsx`

Replace `<Placeholder>` with `<MedicationTab>` in `TabContent`.

## Files

### Create (9)
1. `database/migrations/*_create_visits_table.php`
2. `database/migrations/*_add_visit_id_to_consultations_table.php`
3. `database/migrations/*_add_visit_id_to_paraclinic_requests_table.php`
4. `database/migrations/*_add_visit_id_to_patient_surveillances_table.php`
5. `database/migrations/*_add_visit_id_to_patient_attachments_table.php`
6. `database/migrations/*_create_medication_administrations_table.php`
7. `app/Models/Visit.php`
8. `app/Models/MedicationAdministration.php`
9. `app/Http/Controllers/MedicationAdministrationController.php`
10. `app/Http/Requests/StoreMedicationAdministrationRequest.php`
11. `resources/js/interfaces/IMedicationAdministration.ts`
12. `resources/js/pages/patients/partials/tab/medication.tsx`
13. `resources/js/pages/patients/partials/tab/medicationForm.tsx`

### Modify (7)
1. `app/Models/Consultation.php` — add `visit_id` to fillable, add `visit()` relationship
2. `app/Http/Controllers/ConsultationController.php` — visit logic in store/destroy/create
3. `app/Http/Controllers/PatientController.php` — add medication props, active visits
4. `app/Http/Controllers/PatientSurveillanceController.php` — accept `visit_id`
5. `app/Http/Controllers/ParaclinicRequestController.php` — accept `visit_id`
6. `resources/js/pages/patients/show.tsx` — wire up MedicationTab
7. `routes/web.php` — medication administration routes
