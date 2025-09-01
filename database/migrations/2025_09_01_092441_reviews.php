<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            // $table->uuid('product_id')->nullable();
            // $table->uuid('reviewer_id');
            // $table->uuid('order_id')->nullable();
            $table->integer('rating')->unsigned();
            $table->text('comment')->nullable();
            $table->json('image_urls')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamps();

            $table->foreignId('product_id')->references('id')->on('products');
            $table->foreignId('reviewer_id')->references('id')->on('users');
            $table->foreignId('order_id')->references('id')->on('orders');
            // $table->index(['product_id', 'is_verified']);
            // $table->index('reviewer_id');

            // $table->check('rating >= 1 AND rating <= 5');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
