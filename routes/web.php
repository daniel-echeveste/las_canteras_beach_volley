<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MatchController; 
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
    return Inertia::render('LandingPage', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/liga-autonomica', function () {
    return Inertia::render('AutonomicLeague');
})->name('autonomic.league');

Route::get('/blog', function () {
    return Inertia::render('Blog');
})->name('blog');

Route::get('/top-players', function () {
    return Inertia::render('TopPlayers');
})->name('top.players');

Route::get('/clubes-voleibol', function () {
    return Inertia::render('VolleyballClubs');
})->name('volleyball.clubs');

Route::get('/webgl', function () {
    return Inertia::render('WebGL/WebGLIndex');
})->name('webgl.index');

Route::get('/webgl/exp1', function () {
    return Inertia::render('WebGL/Exp1_FloatingBall/Exp1');
})->name('webgl.exp1');

Route::get('/webcams', function () {
    return Inertia::render('WebCams');
})->name('webcams');

Route::get('/webgl/exp2', function () {
    return Inertia::render('WebGL/Exp2_GoldenSands/Exp2');
})->name('webgl.exp2');

Route::get('/webgl/exp3', function () {
    return Inertia::render('WebGL/Exp3_OceanSunset/Exp3');
})->name('webgl.exp3');

Route::get('/webgl/exp4', function () {
    return Inertia::render('WebGL/Exp4_InteractiveCourt/Exp4');
})->name('webgl.exp4');

Route::get('/webgl/exp5', function () {
    return Inertia::render('WebGL/Exp5_AbstractEnergy/Exp5');
})->name('webgl.exp5');


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



require __DIR__.'/auth.php';
