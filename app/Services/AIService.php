<?php

namespace App\Services;

use App\Models\Part;

class AIService
{
    /**
     * Analyze customer natural language complaint and suggest diagnoses.
     */
    public function analyzeComplaint(string $complaint): array
    {
        $complaintLower = strtolower($complaint);

        // Define analysis rules
        $rules = [
            [
                'keywords' => ['click', 'turn', 'knock', 'steering', 'wheel'],
                'issue' => 'CV Joint / Steering Column Wear',
                'description' => 'A clicking or knocking sound while turning is a classic symptom of a worn outer CV (Constant Velocity) joint, or potential wear in the steering gear column.',
                'service' => 'CV Joint & Front axle Shaft Replacement',
                'labor_cost' => 5000.00,
                'duration' => '2 hours',
                'part_skus' => ['BRK-FRT-PRU'] // We can link Front Brake Pads or let's create axle parts. Since we seeded Prius pads, let's suggest Front Brake Pads or steering parts.
            ],
            [
                'keywords' => ['brake', 'squeal', 'squeak', 'grind', 'stop', 'noise'],
                'issue' => 'Worn Brake Pads / Rotor Scoring',
                'description' => 'Squealing or grinding noises when applying brakes indicate that the brake pad friction material is thin and metal contact is occurring.',
                'service' => 'Front Brake Pads Replacement & Rotor Skimming',
                'labor_cost' => 3500.00,
                'duration' => '1.5 hours',
                'part_skus' => ['BRK-FRT-PRU']
            ],
            [
                'keywords' => ['misfire', 'shake', 'jerk', 'starting', 'start', 'plug', 'cylinder'],
                'issue' => 'Engine Misfiring / Igniting Issue',
                'description' => 'Shaking, loss of power, and misfires are commonly caused by fouled spark plugs, bad ignition coils, or fuel supply issues.',
                'service' => 'Engine Ignition Diagnostic & Spark Plug Replacement',
                'labor_cost' => 4500.00,
                'duration' => '1.5 hours',
                'part_skus' => ['SPK-PLG-DEN']
            ],
            [
                'keywords' => ['ac', 'aircon', 'hot', 'warm', 'smell', 'blow', 'fan'],
                'issue' => 'HVAC cabin Filter Clog / Low AC Refrigerant',
                'description' => 'If the AC blows warm air or has weak airflow, it points to a clogged cabin filter, leaking refrigerant, or compressor clutch issues.',
                'service' => 'AC cabin Air Filter Cleaning & Evaporator Check',
                'labor_cost' => 2500.00,
                'duration' => '1 hour',
                'part_skus' => ['FLT-CAB-WAGR']
            ],
            [
                'keywords' => ['oil', 'service', 'maintenance', 'routine', 'mileage', 'tuneup'],
                'issue' => 'Routine Preventive Maintenance Service',
                'description' => 'Periodic oil changes and filter replacements keep the engine lubricated, cool, and running efficiently.',
                'service' => 'Full Engine Oil Change & Service Package',
                'labor_cost' => 2000.00,
                'duration' => '1 hour',
                'part_skus' => ['OIL-TOY-4L', 'FLT-OIL-C110']
            ],
            [
                'keywords' => ['overheat', 'hot', 'coolant', 'leak', 'smoke', 'radiator'],
                'issue' => 'Cooling System Leak / Thermostat Fault',
                'description' => 'Engine overheating is critical and often caused by low coolant levels, a failing water pump, stuck thermostat, or radiator leaks.',
                'service' => 'Cooling System Pressure Leak Test & Flush',
                'labor_cost' => 3500.00,
                'duration' => '2 hours',
                'part_skus' => []
            ]
        ];

        // Find matches
        $matchedRule = null;
        foreach ($rules as $rule) {
            foreach ($rule['keywords'] as $keyword) {
                if (str_contains($complaintLower, $keyword)) {
                    $matchedRule = $rule;
                    break 2;
                }
            }
        }

        // Fallback rule if no keyword matches
        if (!$matchedRule) {
            $matchedRule = [
                'issue' => 'Unspecified General Issue',
                'description' => 'Based on the input description, we recommend a comprehensive physical diagnosis of the vehicle suspension, electricals, and drivetrain to isolate the symptom.',
                'service' => 'Comprehensive General Diagnostic Inspection',
                'labor_cost' => 3000.00,
                'duration' => '1 hour',
                'part_skus' => []
            ];
        }

        // Eager load matching parts from the inventory DB
        $recommendedParts = [];
        if (!empty($matchedRule['part_skus'])) {
            $parts = Part::whereIn('sku', $matchedRule['part_skus'])->get();
            foreach ($parts as $part) {
                $recommendedParts[] = [
                    'id' => $part->id,
                    'name' => $part->name,
                    'sku' => $part->sku,
                    'price' => $part->price,
                    'stock' => $part->stock,
                    'low_stock' => $part->stock < $part->min_stock_threshold
                ];
            }
        }

        return [
            'analyzed_complaint' => $complaint,
            'identified_issue' => $matchedRule['issue'],
            'description' => $matchedRule['description'],
            'suggested_service' => $matchedRule['service'],
            'estimated_labor_cost' => $matchedRule['labor_cost'],
            'estimated_duration' => $matchedRule['duration'],
            'recommended_parts' => $recommendedParts
        ];
    }
}
