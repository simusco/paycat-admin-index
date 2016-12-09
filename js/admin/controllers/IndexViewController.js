var ctrl = [
'$scope',
'$state',
'$rootScope',
'$cookies',
'SocketService',
function($scope, $state, $rootScope, $cookies, socketService){
	var token = $cookies.get('token');
	if(token == null){
		$state.go('login');
		return;
	}

	var socket = socketService.socket;
	//加载消息
	socket.emit('load-msg', {token:token});
	//加载设备
	socket.emit('load-user-equip', {token:token});

}];

module.exports = ctrl;