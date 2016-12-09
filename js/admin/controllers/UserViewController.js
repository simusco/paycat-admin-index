var ctrl = [
'$scope',
'$state',
'$interval',
'$cookies',
'SocketService',
function($scope, $state, $interval, $cookies, socketService){
	var token = $cookies.get('token');
	if(token == null){
		$state.go('login');
		return;
	}

	var socket = socketService.socket;
	//加载用户信息
	socket.emit('load-user', {token:token});

	//处理用户信息
	socket.on('load-user-done', function(resp){
		var code = resp.code;
		var msg = resp.msg;
		var data = resp.result;

		if(code == 100){
			$scope.user = data;
		}else{
			alert('加载用户信息出现错误');
		}
	});

}];

module.exports = ctrl;