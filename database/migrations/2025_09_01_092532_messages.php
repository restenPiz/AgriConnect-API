<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            // $table->uuid('sender_id');
            // $table->uuid('receiver_id');
            // $table->uuid('order_id')->nullable();
            $table->text('content');
            $table->enum('message_type', ['text', 'image', 'location', 'system']);
            $table->json('attachments')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->foreignId('sender_id')->references('id')->on('users');
            $table->foreignId('receiver_id')->references('id')->on('users');
            $table->foreignId('order_id')->references('id')->on('orders');
            // $table->index(['sender_id', 'receiver_id']);
            // $table->index(['order_id', 'created_at']);
            // $table->index('is_read');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
