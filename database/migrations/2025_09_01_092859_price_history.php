<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('price_history', function (Blueprint $table) {
            $table->id();
            $table->decimal('price', 10, 2);
            $table->date('date_recorded');
            $table->json('market_conditions')->nullable();
            $table->timestamps();

            $table->foreignId('product_id')->references('id')->on('products');
            $table->index(['product_id', 'date_recorded']);
            $table->unique(['product_id', 'date_recorded']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_history');
    }
};
