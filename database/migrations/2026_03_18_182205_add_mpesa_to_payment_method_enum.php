<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Alterar ENUM para incluir 'mpesa'
        DB::statement("ALTER TABLE `orders` MODIFY `payment_method` ENUM('mobile_money', 'cash', 'bank_transfer', 'mpesa') NOT NULL");
    }

    public function down(): void
    {
        // Reverter para ENUM original
        DB::statement("ALTER TABLE `orders` MODIFY `payment_method` ENUM('mobile_money', 'cash', 'bank_transfer') NOT NULL");
    }
};
