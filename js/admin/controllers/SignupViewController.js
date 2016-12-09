var ctrl = ['$scope','$resource', '$state', '$interval','$location','$rootScope', 'SocketService', function($scope, $resource, $state, $interval, $location, $rootScope, socketService){

	function isEmpty(value){
		if(value == null || value == undefined || value == ''){
			return true;
		}

		return false;
	}

	var user = $scope.user = {uid:'',pwd:''};
	var socket = socketService.socket;
	$scope.success = false;

	socket.on('user-reg-done', function(resp){
		var code = resp.code;
		var msg = resp.msg;
		var data = resp.result;

		if(code == 100){
			$scope.success = true;
		}else{
			$scope.errmsg = msg;
		}
	});

	$scope.signup = function(){
		//注册用户测试
		if(isEmpty(user.uid)){
			$scope.errmsg = '注册帐号必须填写';
			return;
		}

		if(isEmpty(user.pwd1)){
			$scope.errmsg = '密码必须填写';
			return;
		}

		if(isEmpty(user.pwd2)){
			$scope.errmsg = '密码必须填写';
			return;
		}

		if(user.pwd1 != user.pwd2){
			$scope.errmsg = '两次密码不一致';
			return;
		}

		if(isEmpty(user.telephone)){
			$scope.errmsg = '必须填写联系方式';
			return;
		}

		socket.emit('user-reg', user);
	};

	$scope.isEmpty = isEmpty;
}];

module.exports = ctrl;