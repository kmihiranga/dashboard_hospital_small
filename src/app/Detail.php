<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Detail extends Model
{
    use SoftDeletes;

    protected $fillable = ['year', 'book_no', 'piyan_name', 'project_name', 'voucher_no', 'date', 'company', 'hospital', 'payee', 'month', 'sub_total', 'cross_note', 'balance', 'company_total'];

    public function companies()
    {
        return $this->belongsTo('App\Company', 'company');
    }

    public function hospitals()
    {
        return $this->belongsTo('App\Hospital', 'hospital');
    }
}
