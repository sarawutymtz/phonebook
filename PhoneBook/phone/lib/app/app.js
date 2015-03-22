      var app = angular.module('starter', ['ngRoute','angular-md5', 'AuthSrvc']);

      app.config(function($routeProvider, $locationProvider, $httpProvider){
        $routeProvider.when('/login',{
          templateUrl:'templates/login.html',
          controller:'LoginController'
        }).when('/book', {
            templateUrl : 'templates/book.html',
            controller : 'bookController'
          }).otherwise({
            redirectTo: '/login'
          });

        //  $httpProvider.defaults.useXDomain = true;
      });

      app.controller("AppController", function($scope, $location, LocalService){

          $scope.logout = function ()
          {
            LocalService.set('HasToken', LocalService.get('BookToken'));
            LocalService.set('HasauthID', LocalService.get('authId'));
            LocalService.unset('BookToken');
            LocalService.unset('authId');
            $location.path('/login');
          };

      });

      app.controller("LoginController", function($scope, $http, $location, $rootScope, md5, Login, LocalService){

        $rootScope.signin = false;

        if(LocalService.get('BookToken') !== null)
        {

            var BookToken = LocalService.get('BookToken');
            var authId = LocalService.get('authId');

            $http({method:'GET',url:'http://localhost/PhoneService/index.php/api/AuthToken', params :{token : BookToken, authId:authId}})
            .success(function(response){
              if(response === 'expired')
              {
                $location.path('/login');
              } else {
                $location.path('/book');
              }
            });
          }  

        $scope.Signin = function (){
          var username = $scope.username;
          var password = md5.createHash($scope.password);
          var HasToken = LocalService.get('HasToken');
          var HasauthID = LocalService.get('HasauthID');

          $scope.loginData = {name:username, password:password, HasToken:HasToken, HasauthID:HasauthID};

          var auth = Login.auth($scope.loginData);
          auth.success(function(response){
             if(response !== 'invalid'){
                LocalService.set('authId',response.id);
                LocalService.set('BookToken',response.token);
                $location.path('/book');
             } else {
                $scope.loginfield = true;
                $scope.signinbad = "invalid username And password";
             }


          });

        };
      });

      app.controller("bookController", function($scope, $http, $location, $rootScope, LocalService){
        $rootScope.signin = true;        
        $scope.contacts = [];
        var token = LocalService.get('BookToken');

        $http({method:'GET',url:'http://localhost/PhoneService/index.php/api/contacts', params :{token : token}}).success(function(response){
            if(response === 'expired')
            {
              $location.path('/login');
            } else {
              $scope.contacts = response;
            }
        }).error(function() {
          $location.path('/login');
        });

        $scope.madaltitle = function () {
          $("#savephone").hide();
          $('.modal-title').text('Add Contacts');
        };
        
        $scope.add = function ()
        {

          $http({method:'GET',url:'http://localhost/PhoneService/index.php/api/contacts/create',params: {nickname:$scope.nickname, phone:$scope.phone, token : token}}).success(function(response){
            if(response === 'expired')
            {
              $location.path('/login');
            } else {
              $scope.contacts.push(response);
              $('#myModal').modal('hide');
            }
          }).error(function() {
            $location.path('/login');
          });

        };

        
        $scope.deleted = function (id) {
          
        $http.delete('http://localhost/PhoneService/index.php/api/contacts/'+id+'?token='+token)
        .success(function(response) {

          if(response === 'expired')
          {
            $location.path('/login');

          } else {
          
            for (var i = 0; i < $scope.contacts.length; i++) {
              if($scope.contacts[i].id === id)
              {
                $scope.contacts.splice(i, 1);
              }
            }

          }

          });       

        };


        $scope.openlist = function (id) {
            
            for (var i = 0; i < $scope.contacts.length; i++) {
                if($scope.contacts[i].id === id)
                {
                  $scope.nickname = $scope.contacts[i].name;
                  $scope.phone = $scope.contacts[i].phone;
                }
            }
          $scope.idrow = id;
          $('.modal-title').text('Edit Contacts');
        };

        $scope.updatelist = function () {
        
          $http({method:'PUT',url:'http://localhost/PhoneService/index.php/api/contacts/'+ $scope.idrow, params: {nickname:$scope.nickname, phone:$scope.phone, token : token}})
        .success(function(response) {
          if(response === 'expired')
          {
            $location.path('/login');
          } else {

            for (var i = 0; i < $scope.contacts.length; i++) {
              if($scope.contacts[i].id === $scope.idrow)
              {
                $scope.contacts[i].name = $scope.nickname;
                $scope.contacts[i].phone = $scope.phone;
              }
            }

            $('#myModal').modal('hide'); 
          
          }
          }).error(function() {
            $location.path('/login');
          });

      };

          $('#myModal').on('hide.bs.modal', function (event) {
              $scope.idrow = undefined;
              $scope.nickname = undefined;
              $scope.phone = undefined;  
          });    


        $('#txtPhone').keyup(function(e) {
          if (validatePhone('txtPhone') && $("#txtPhone").val().length > 9) {
            $('#spnPhoneStatus').html('Valid');
            $('#spnPhoneStatus').css('color', 'green');
            if($('#txtName').val().length > 2)
            {
              $("#savephone").show();
            }
          } else {
            $('#spnPhoneStatus').html('Invalid');
            $('#spnPhoneStatus').css('color', 'red');
            $("#savephone").hide();
          }
        });

        $('#txtName').keyup(function(e) { 
          if($('#txtName').val().length > 2)
          {    
            $('#spnNameStatus').html('Valid');
            $('#spnNameStatus').css('color', 'green');
            if (validatePhone('txtPhone') && $("#txtPhone").val().length > 9) {
              $("#savephone").show();
            }
          } else {
            $('#spnNameStatus').html('Invalid');
            $('#spnNameStatus').css('color', 'red');
            $("#savephone").hide();
          }
        });  

        function validatePhone(txtPhone) {
            var a = document.getElementById(txtPhone).value;
            var filter = /^[0-9-+]+$/;
            if (filter.test(a)) {
                return true;
            }
            else {
                return false;
            }
        }

      });
 