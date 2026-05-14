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
        Schema::table('users', function (Blueprint $table) {

            $table->string('last_name')->nullable()->after('name');
            $table->string('avatar')->nullable()->after('last_name');
            $table->string('phone')->nullable()->after('avatar');
            $table->string('address')->nullable()->after('phone');


            $table->string('doc_type', 20)->nullable();
            $table->string('doc_number')->nullable()->after('doc_type');

            $table->unique(['doc_type', 'doc_number']);

            $table->unsignedBigInteger('branch_id')->nullable();
            //$table->unsignedBigInteger('rol_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'last_name',
                'avatar',
                'phone',
                'doc_type',
                'doc_number',
                'branch_id',
                //'rol_id',
                'address'
            ]);
        });
    }
};
