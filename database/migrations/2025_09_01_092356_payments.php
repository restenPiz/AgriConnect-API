<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            // $table->uuid('order_id');
            // $table->uuid('payer_id');
            // $table->uuid('payee_id');
            $table->decimal('amount', 10, 2);
            $table->enum('payment_method', ['m_pesa', 'e_mola', 'cash', 'bank_transfer']);
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'refunded']);
            $table->string('transaction_id', 100)->unique();
            $table->string('external_transaction_id', 100)->nullable();
            $table->string('phone_number', 20)->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->foreignId('order_id')->references('id')->on('orders');
            $table->foreignId('payer_id')->references('id')->on('users');
            $table->foreignId('payee_id')->references('id')->on('users');
            // $table->index(['order_id', 'status']);
            // $table->index('external_transaction_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
