<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('delivery_tracking', function (Blueprint $table) {
            $table->id();
            $table->geometry('current_location', 'point')->nullable();
            $table->enum('status', ['pickup_pending', 'in_transit', 'delivered', 'failed']);
            $table->timestamp('estimated_arrival')->nullable();
            $table->timestamp('actual_arrival')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreignId('order_id')->references('id')->on('orders');
            $table->foreignId('transporter_id')->references('id')->on('users');
            // $table->index(['order_id', 'status']);
            // $table->index('current_location');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_tracking');
    }
};
