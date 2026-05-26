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
        Schema::table('branches', function (Blueprint $table) {
         
            $table->string('address')->after('name');
            $table->string('city')->after('address');
            $table->string('country')->after('city');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('branches', function (Blueprint $table) {
           $table->dropColumn(['name', 'address', 'city', 'country']);
            $table->dropSoftDeletes();
        });
    }
};
