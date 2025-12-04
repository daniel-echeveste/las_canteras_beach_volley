<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'image_path',
        'is_published',
        'post_type',
        'event_date',
        'contact_email',
        'email_subject',
        'has_form',
        'form_fields',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'event_date' => 'datetime',
        'has_form' => 'boolean',
        'form_fields' => 'array',
    ];

    public function tournamentRegistrations()
    {
        return $this->hasMany(TournamentRegistration::class);
    }
}
