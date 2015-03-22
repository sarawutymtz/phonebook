<?php namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Contacts;
use App\Token;

class ContactsController extends Controller {

	public function AuthData ($request)
    {
    	$model = Token::where('token', $request->input('token'))->where('date_expire', '>', date("Y-m-d H:i:s"))->get();
		if(!$model->isEmpty())
		{
			return 'Unexpired';	
		} else {
			return 'expired';
		}
		
	}
	
	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index(Request $request)
	{
		if($this->AuthData($request) == 'expired')
		{
			return 'expired';
		} else {
			return Contacts::all()->toJson();			
		}
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create(Request $request)
	{

		if($this->AuthData($request) == 'expired')
		{
			return 'expired';
		} else {

		$Contacts = new Contacts;
		$Contacts->name = $request->input('nickname');
		$Contacts->phone = $request->input('phone');
		$Contacts->save();
		
		$create = [
				'id' => $Contacts->id,
				'name' => $request->input('nickname'), 
				'phone' => $request->input('phone') 
				];

		return json_encode($create);
		}

	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		//
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id, Request $request)
	{
		if($this->AuthData($request) == 'expired')
		{
			return 'expired';
		} else {

			$Contacts = Contacts::find($id);
			$Contacts->name = $request->input('nickname');
			$Contacts->phone = $request->input('phone');
			$Contacts->save();

			$update = [
					'id' => $Contacts->id,
					'name' => $request->input('nickname'), 
					'phone' => $request->input('phone') 
					];

			return json_encode($update);
		}

	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id, request $request)
	{
		if($this->AuthData($request) == 'expired')
		{
			return 'expired';
		} else {
			Contacts::where('id', '=', $id)->delete();
		}
	}

}
