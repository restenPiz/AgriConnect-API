<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('farmer_id');
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->enum('unit', ['kg', 'g', 'piece', 'bunch', 'bag', 'liter']);
            $table->decimal('available_quantity', 10, 2);
            $table->json('image_urls')->nullable();
            $table->enum('category', ['vegetables', 'fruits', 'grains', 'legumes', 'herbs', 'roots', 'dairy', 'meat']);
            $table->point('location')->nullable();
            $table->date('harvest_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->boolean('is_organic')->default(false);
            $table->enum('status', ['active', 'soldOut', 'expired', 'inactive'])->default('active');
            $table->decimal('rating', 2, 1)->nullable();
            $table->integer('review_count')->default(0);
            $table->json('tags')->nullable();
            $table->decimal('total_sold', 10, 2)->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('farmer_id')->references('id')->on('users');
            $table->index(['farmer_id', 'status']);
            $table->index(['category', 'status']);
            $table->index('location');
            $table->index('expiry_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
