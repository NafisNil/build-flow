<?php

namespace App\Services;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiCostEstimator
{
    /**
     * Create a new class instance.
     */
    public function generateEstimate(string $projectName, string $phaseName, int $plotCount) : ?float
    {
        $apiKey = config('services.gemini.api_key');
        $prompt = "You are an expert UK construction quantity surveyor. Estimate the baseline cost in GBP for the '{$phaseName}' phase of a residential development project named '{$projectName}' consisting of {$plotCount} units. Return ONLY a raw, realistic numeric value. Do not include currency symbols, commas, or any explanatory text.";
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
               // 'Authorization' => 'Bearer ' . $apiKey,
            ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
                'contents' => [
                    ['parts' => [['text' => $prompt]]]
                ]
            ]);

            if ($response->successful()) {
                $result = $response->json('candidates.0.content.0.parts.0.text');
                return (float) preg_replace('/[^0-9.]/', '', $result);
            }
        } catch (\Exception $e) {
            Log::error('Failed to generate estimate: ' . $e->getMessage());
        }

        return null;
    }
}
