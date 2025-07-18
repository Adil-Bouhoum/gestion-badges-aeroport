<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BadgeRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'requested_zones',
        'valid_from',
        'valid_until',
        'status',
        'admin_comment',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function badge()
    {
        return $this->hasOne(Badge::class);
    }
}
