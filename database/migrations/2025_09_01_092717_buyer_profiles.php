<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('buyer_profiles', function (Blueprint $table) {
            $table->id();
            // $table->uuid('buyer_id')->unique();
            $table->string('business_name', 100)->nullable();
            $table->enum('business_type', ['restaurant', 'grocery', 'individual', 'wholesaler']);
            $table->string('tax_number', 50)->nullable();
            $table->json('preferred_suppliers')->nullable();
            $table->decimal('average_order_value', 10, 2)->nullable();
            $table->timestamps();

            $table->foreignId('buyer_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('buyer_profiles');
    }
};
