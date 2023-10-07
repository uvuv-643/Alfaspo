<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('price_connectors', function (Blueprint $table) {
            $table->id();
            $table->double('price_connector')->default(0);
            $table->double('price_screw')->default(0);
            $table->double('price_anchor')->default(0);
            $table->double('price_pin')->default(0);
            $table->double('weight_connector')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('price_connectors');
    }
};
