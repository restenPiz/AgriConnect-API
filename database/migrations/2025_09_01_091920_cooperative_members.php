<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cooperative_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('cooperative_id');
            $table->uuid('farmer_id');
            $table->enum('role', ['coordinator', 'treasurer', 'member']);
            $table->decimal('contribution_percentage', 5, 2)->nullable();
            $table->enum('status', ['active', 'inactive', 'pending']);
            $table->timestamp('joined_at')->nullable();
            $table->timestamp('left_at')->nullable();
            $table->timestamps();

            $table->foreign('cooperative_id')->references('id')->on('cooperatives');
            $table->foreign('farmer_id')->references('id')->on('users');
            $table->unique(['cooperative_id', 'farmer_id']);
            $table->index(['cooperative_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cooperative_members');
    }
};
