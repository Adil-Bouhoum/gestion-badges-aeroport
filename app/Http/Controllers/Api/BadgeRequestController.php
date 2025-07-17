<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BadgeRequest;
use App\Models\Badge;

class BadgeRequestController extends Controller
{
    /**
     * Get all badge requests (for admin) or user's own requests
     */
    public function index(Request $request)
    {
        $query = BadgeRequest::with('user:id,name,email');

        // If user is not admin, filter by their own requests
        if (!$request->user()->isAdmin()) {
            $query->where('user_id', $request->user()->id);
        }

        $requests = $query->latest()->get();

        return response()->json($requests);
    }

    /**
     * Submit a new badge request
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:1_day,1_week,1_month,3_months,6_months,1_year,permanent',
            'request_reason' => 'required|string|max:500',
            'requested_zones' => 'required|string',
            'valid_from' => 'required|date|after_or_equal:today',
            'valid_until' => 'required_if:type,1_day,1_week,1_month,3_months,6_months,1_year|date|after_or_equal:valid_from|nullable',
        ]);

        $badgeRequest = BadgeRequest::create([
            'user_id' => $request->user()->id,
            'type' => $validated['type'],
            'request_reason' => $validated['request_reason'],
            'requested_zones' => $validated['requested_zones'],
            'valid_from' => $validated['valid_from'],
            'valid_until' => $validated['valid_until'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json($badgeRequest, 201);
    }

    /**
     * Approve or reject a badge request (Admin only)
     */
    public function updateStatus(Request $request, $id)
    {
        // Verify admin access
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_comment' => 'required_if:status,rejected|string|max:500|nullable',
        ]);

        $badgeRequest = BadgeRequest::findOrFail($id);

        $badgeRequest->update([
            'status' => $validated['status'],
            'admin_comment' => $validated['admin_comment'],
            'processed_at' => now(),
        ]);

        // Create badge if approved
        if ($validated['status'] === 'approved') {
            Badge::create([
                'user_id' => $badgeRequest->user_id,
                'badge_request_id' => $badgeRequest->id,
                'numero' => 'BDG-' . now()->format('Ymd') . '-' . strtoupper(uniqid()),
                'type' => $badgeRequest->type,
                'zones_acces' => $badgeRequest->requested_zones,
                'date_emission' => now(),
                'date_expiration' => $badgeRequest->valid_until,
                'statut' => 'actif',
            ]);
        }

        return response()->json([
            'message' => 'Badge request status updated successfully',
            'data' => $badgeRequest
        ]);
    }
}
