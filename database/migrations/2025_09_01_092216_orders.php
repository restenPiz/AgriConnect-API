<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('buyer_id');
            $table->uuid('cooperative_id')->nullable();
            $table->decimal('total_amount', 10, 2);
            $table->enum('status', ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled']);
            $table->json('delivery_address')->nullable();
            $table->point('delivery_location')->nullable();
            $table->timestamp('delivery_date')->nullable();
            $table->enum('payment_method', ['mobile_money', 'cash', 'bank_transfer']);
            $table->enum('payment_status', ['pending', 'processing', 'completed', 'failed', 'refunded']);
            $table->text('notes')->nullable();
            $table->decimal('delivery_fee', 10, 2)->default(0);
            $table->decimal('service_fee', 10, 2)->default(0);
            $table->timestamps();

            $table->foreign('buyer_id')->references('id')->on('users');
            $table->foreign('cooperative_id')->references('id')->on('cooperatives');
            $table->index(['buyer_id', 'status']);
            $table->index(['cooperative_id', 'status']);
            $table->index('delivery_date');
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
