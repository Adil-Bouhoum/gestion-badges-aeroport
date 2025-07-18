<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    use HasFactory;


    protected $fillable = ['user_id', 'badge_request_id', 'badge_number', 'issued_at', 'expires_at', 'pdf_path'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function badgeRequest()
    {
        return $this->belongsTo(BadgeRequest::class);
    }
}
