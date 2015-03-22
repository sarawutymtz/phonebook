<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Token extends Model {

	protected $table = 'Token';
	protected $fillable = ['token', 'date_expire'];
	protected $hidden = ['id','userId','updated_at'];
}
