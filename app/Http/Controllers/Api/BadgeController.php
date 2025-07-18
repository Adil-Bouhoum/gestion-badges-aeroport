<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;
use App\Models\Badge;
use App\Models\BadgeRequest;

class BadgeController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'badge_request_id' => 'required|exists:badge_requests,id',
            'badge_number' => 'required|unique:badges,badge_number',
        ]);

        $badgeRequest = BadgeRequest::findOrFail($request->badge_request_id);

        if ($badgeRequest->status !== 'approved') {
            return response()->json(['message' => 'Badge request is not approved'], 403);
        }

        $badge = Badge::create([
            'user_id' => $badgeRequest->user_id,
            'badge_request_id' => $badgeRequest->id,
            'badge_number' => $request->badge_number,
            'expires_at' => $badgeRequest->valid_until,
        ]);

        // Generate PDF using Blade view
        $pdf = Pdf::loadView('badges.badge', [
            'badge_number' => $badge->badge_number,
            'user' => $badge->user,
            'zones' => $badgeRequest->requested_zones,
            'valid_until' => $badgeRequest->valid_until,
        ]);

        // Ensure directory exists
        $directory = storage_path('app/public/badges/');
        if (!file_exists($directory)) {
            mkdir($directory, 0755, true);
        }

        $filename = 'badge_' . Str::random(10) . '.pdf';
        $pdf->save($directory . $filename);

        $badge->update(['pdf_path' => 'storage/badges/' . $filename]);

        return response()->json([
            'message' => 'Badge created successfully',
            'badge' => $badge,
            'pdf_url' => asset('storage/badges/' . $filename),
        ], 201);
    }
}
