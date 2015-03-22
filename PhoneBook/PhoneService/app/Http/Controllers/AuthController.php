<?php namespace App\Http\Controllers;
use Auth;
use App\User;
use App\Token;
use Illuminate\Http\Request;

class AuthController extends Controller {

	public function Login(Request $request){

			if(Auth::attempt(['name'=> $request->input('name'), 'password' => $request->input('password')])) {
			   
			   	$user = Auth::user();
			   	if(!empty($request->input('HasToken')))
			   	{
			   		$model = Token::where('token', $request->input('HasToken'))->
			   		where('date_expire', '>', date("Y-m-d H:i:s"))->
			   		where('userId', $request->input('HasauthID'))->get();	

				} 

					if($model->isEmpty())
					{
						$Token = new Token;
						$Token->token = sha1(date("Y-m-d H:i:s")).mt_rand( 0, 0xffff );
						$Token->date_expire = date("Y-m-d H:i:s", mktime(date("H"), date("i")+30, date("s"), date("m"), date("d"), date("Y")));
						$Token->userId = $user->id;
						$Token->save();
						$res = json_encode(['id'=>$user->id,'token'=>$Token->token]);
					} else {
						$res = json_encode(['id'=>$model[0]->userId,'token'=>$model[0]->token]);
					}

				return $res;
			} else {
				return 'invalid';
			}

	}

	public function AuthToken (Request $request)
    {
    	$model = Token::where('token', $request->input('token'))->
    			where('date_expire', '>', date("Y-m-d H:i:s"))->
    			where('userId', $request->input('authId'))->get();
		if(!$model->isEmpty())
		{
			return 'Unexpired';	
		} else {
			return 'expired';
		}
		
	}
 

}
