<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('details', function (Blueprint $table) {
            $table->increments('id');
            $table->string('year')->nullable();
            $table->string('book_no')->nullable();
            $table->string('piyan_name')->nullable();
            $table->string('project_name')->nullable();
            $table->string('voucher_no');
            $table->string('date');
            $table->unsignedInteger('company');
            $table->unsignedInteger('hospital');
            $table->string('payee');
            $table->string('month');
            $table->float('sub_total', 11, 2);
            $table->float('cross_note', 11, 2)->nullable();
            $table->float('balance', 11, 2)->nullable();
            $table->float('company_total', 11, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('details', function (Blueprint $table) {
            $table->foreign('company')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('hospital')->references('id')->on('hospitals')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('details');
    }
}
