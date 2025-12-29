<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MatchController; 
use App\Http\Controllers\RankingController;
use App\Http\Controllers\TournamentRegistrationController;
use App\Http\Controllers\AutonomicLeagueController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    $latestPosts = \App\Models\Post::where('is_published', true)
        ->latest()
        ->take(3)
        ->get();

    return Inertia::render('LandingPage', [
        'latestPosts' => $latestPosts,
    ]);
});

Route::get('/liga-autonomica', [AutonomicLeagueController::class, 'index'])->name('autonomic.league');

Route::get('/blog', [\App\Http\Controllers\BlogController::class, 'index'])->name('blog');
Route::get('/blog/{slug}', [\App\Http\Controllers\BlogController::class, 'show'])->name('blog.show');

Route::post('/tournament-registration/{postId}', [TournamentRegistrationController::class, 'store'])->name('tournament.register');



Route::get('/ranking', [RankingController::class, 'index'])->name('ranking');

Route::get('/forecast', function () {
    return Inertia::render('Forecast');
})->name('forecast');

Route::get('/clubes-voleibol', function () {
    return Inertia::render('VolleyballClubs');
})->name('volleyball.clubs');

Route::get('/webgl', function () {
    return Inertia::render('WebGL/WebGLIndex');
})->name('webgl.index');



Route::get('/webcams', function () {
    return Inertia::render('WebCams');
})->name('webcams');



Route::get('/webgl/exp6', function () {
    return Inertia::render('WebGL/Exp6_BeachVolley/Exp6');
})->name('webgl.exp6');


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('posts', \App\Http\Controllers\Admin\PostController::class);
        Route::resource('matches', \App\Http\Controllers\Admin\MatchController::class);
        Route::get('/ads', [\App\Http\Controllers\Admin\AdSettingsController::class, 'index'])->name('ads.index');
        Route::post('/ads', [\App\Http\Controllers\Admin\AdSettingsController::class, 'update'])->name('ads.update');
    });
});



require __DIR__.'/auth.php';
