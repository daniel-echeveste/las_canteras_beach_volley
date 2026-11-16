<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Puede existir ya si se creó a mano con database/league_snapshots.sql
        if (Schema::hasTable('league_snapshots')) {
            return;
        }

        Schema::create('league_snapshots', function (Blueprint $table) {
            $table->id();
            $table->string('season', 16);
            $table->string('category', 16);
            $table->longText('payload');
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();

            $table->unique(['season', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('league_snapshots');
    }
};
