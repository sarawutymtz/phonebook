var login = angular.module('AuthSrvc',[]);
 

login.factory('Login',function($http){
	return{
		auth:function(credentials){
			var authUser = $http({method:'GET',url:'http://localhost/PhoneService/index.php/api/login/auth',params:credentials});
			return authUser;
		}
	}
});

login.factory('LocalService',function(){
	return{
		get:function(key){
			return localStorage.getItem(key);
		},
		set:function(key,val){
			return localStorage.setItem(key,val);
		},
		unset:function(key){
			return localStorage.removeItem(key);
		}
	}
});