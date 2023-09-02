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
        Schema::create('prices', function (Blueprint $table) {
            $table->id();
            $table->integer('width');
            $table->integer('height');
            $table->integer('margin')->nullable();
            $table->foreignId('material_id')->constrained()->cascadeOnDelete();
            $table->foreignId('color_id')->constrained()->cascadeOnDelete();
            $table->double('price')->default(0);
            $table->double('price_stringer')->default(0);
            $table->double('price_connector')->default(0);
            $table->double('price_screw')->default(0);
            $table->double('price_anchor')->default(0);
            $table->double('price_pin')->default(0);
            $table->double('weight')->default(0);
            $table->double('weight_stringer')->default(0);
            $table->double('weight_connector')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prices');
    }
};
