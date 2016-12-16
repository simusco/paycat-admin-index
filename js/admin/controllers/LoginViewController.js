var ctrl = ['$scope','$resource', '$state', '$rootScope', '$cookies', 'SocketService', function($scope, $resource, $state, $rootScope, $cookies, socketService){

	function isEmpty(value){
		if(value == null || value == undefined || value == ''){
			return true;
		}

		return false;
	}

	var user = $scope.user = {uid:$cookies.get('uid'),pwd:$cookies.get('pwd'),remPwd:false};

	$scope.login = function(){
		if(isEmpty(user.uid) || isEmpty(user.pwd)){
			$scope.errmsg = '必须填写用户名或密码！';
			return;
		}

		var socket = socketService.socket;
		socket.emit('user-login', $scope.user);

		//登录回调
		socket.on('user-login-done', function(resp){
			var code = resp.code;
			var msg = resp.msg;
			var data = resp.result;

			if(code == 100){
				var d = new Date();
				d.setFullYear(d.getFullYear() + 1);

				$cookies.put('uid',user.uid,{expires : d});
				if(user.remPwd){
					$cookies.put('pwd',user.pwd,{expires : d});
				}else{
					$cookies.put('pwd',null);
				}
				$cookies.put('token',data.token);
				$cookies.put('roleId',data.roleId);

				if(data.roleId == 1) {
					$state.go('customer.statistics_shop');
				}else if(data.roleId == 2){
					$state.go('shopper.statistics_shop');
				}else if(data.roleId == 3){
					$state.go('admin.mantain_equip');
				}else if(data.roleId == 4){
					$state.go('waiter.main');
				}
			}else{
				$scope.errmsg = msg;
			}
		});
	}

	$scope.isEmpty = isEmpty;
	$scope.$watch('user.uid',function(){if(!isEmpty($scope.errmsg)){$scope.errmsg = '';}});
	$scope.$watch('user.pwd',function(){if(!isEmpty($scope.errmsg)){$scope.errmsg = '';}});

}];

export default ctrl;