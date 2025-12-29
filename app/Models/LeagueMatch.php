<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeagueMatch extends Model
{
    use HasFactory;

    protected $table = 'matches';

    protected $fillable = [
        'jornada',
        'date',
        'time',
        'local_team',
        'visitor_team',
        'court',
        'result',
        'category', // 'male' or 'female'
    ];

    protected $casts = [
        'date' => 'date',
        'jornada' => 'integer',
    ];
}
