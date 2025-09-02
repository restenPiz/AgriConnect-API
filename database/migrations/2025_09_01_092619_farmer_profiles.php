<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('farmer_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('farm_name', 100)->nullable();
            $table->decimal('farm_size_hectares', 8, 2)->nullable();
            $table->integer('farming_experience_years')->nullable();
            $table->json('certifications')->nullable();
            $table->json('specializations')->nullable();
            $table->json('preferred_crops')->nullable();
            $table->json('farming_methods')->nullable();
            $table->timestamps();

            $table->foreignId('farmer_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('farmer_profiles');
    }
};
