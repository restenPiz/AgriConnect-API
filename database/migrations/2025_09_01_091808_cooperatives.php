<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cooperatives', function (Blueprint $table) {
            $table->id();
            // $table->id('coordinator_id');
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->enum('type', ['temporary', 'permanent']);
            $table->enum('status', ['forming', 'active', 'completed', 'dissolved']);
            $table->integer('member_count')->default(0);
            $table->integer('total_orders')->default(0);
            $table->decimal('total_revenue', 15, 2)->default(0);
            $table->json('governance_rules')->nullable();
            $table->geometry('primary_location', 'point')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreignId('coordinator_id')->references('id')->on('users');
            // $table->foreignId('coordinator_id')->constrained('users')->onDelete('cascade');
            // $table->index(['status', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cooperatives');
    }
};
