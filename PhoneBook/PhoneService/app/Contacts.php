<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Contacts extends Model {

	protected $table = 'contacts';
	protected $fillable = ['id', 'name', 'phone'];
	protected $hidden = ['created_at', 'updated_at'];
	
}
