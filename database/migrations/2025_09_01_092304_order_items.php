<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->decimal('quantity', 10, 2);
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_price', 10, 2);
            $table->enum('status', ['pending', 'confirmed', 'delivered']);
            $table->timestamps();

            $table->foreignId('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreignId('product_id')->references('id')->on('products');
            $table->foreignId('farmer_id')->references('id')->on('users');
            // $table->index(['order_id', 'status']);
            // $table->index('farmer_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
