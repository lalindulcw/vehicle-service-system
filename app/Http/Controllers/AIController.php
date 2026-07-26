<?php

namespace App\Http\Controllers;

use App\Services\AIService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class AIController extends Controller
{
    protected AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Show AI Advisor view.
     */
    public function index(): Response
    {
        return Inertia::render('AI/Advisor');
    }

    /**
     * Analyze complaint via API.
     */
    public function analyze(Request $request): JsonResponse
    {
        $request->validate([
            'complaint' => 'required|string|min:5|max:1000'
        ]);

        $analysis = $this->aiService->analyzeComplaint($request->input('complaint'));

        return response()->json($analysis);
    }
}
