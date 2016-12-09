var ctrl = [
	'$scope',
	'$state',
	'$interval',
	'$cookies',
	'SocketService',
	function($scope, $state, $interval, $cookies, socketService){

	function secTohms(s) {
		var t='';

		if(s > -1){
			var hour = Math.floor(s/3600);
			var min = Math.floor(s/60) % 60;
			var sec = parseInt(s % 60);
			var day = parseInt(hour / 24);

			if(day > 0) t += day + '天';
			if(hour > 0) t += hour + '时';
			if(min > 0) t += min + '分';
			if(sec > 0) t += sec + '秒';
		}

		return t;
	}

	function convertMsgTime(ml, t){
		if(ml == null || ml.length == 0)
			return;

		for(var i=0;i<ml.length;i++){
			ml[i].surplusSecond += t;
			ml[i].surplusSecondDesc = secTohms(ml[i].surplusSecond);
		}
	}

		//定时更新消息的时间
	$interval(function(){var ml = $scope.msgList;convertMsgTime(ml, 5);},5000);

	var socket = socketService.socket;
	//加载用户消息
	//新消息
	socket.on('new-shop-msg', function(data){
		console.log('有新的用户消息:');
		console.log(data);

		//对消息的剩余时间进行计算
		var ds = [data];
		convertMsgTime(ds, 0);

		var msgList = $scope.msgList;
		for(var i=0;i<ds.length;i++){
			msgList.splice(0,0, ds[i]);
		}

		if(msgList.length > 10){
			msgList.splice(10);
		}
	});

	//加载消息完成
	socket.on('load-msg-done', function(data){
		convertMsgTime(data, 0);

		if(data == null) data = [];

		$scope.msgList = data;
	});

	$scope.delMsg = function(msgId){
		var token = $cookies.get('token');
		if(token == null){
			$state.go('login');
			return;
		}

		socket.emit('del-msg', {token:token, msgId:msgId});
	}

	socket.on('del-msg-done',function(resp){
		var code = resp.code;
		var msg = resp.msg;
		var data = resp.result;

		if(code == 100){
			var msgList = $scope.msgList;
			var index = -1;

			for(var i=0;i<msgList.length;i++){
				if(msgList[i].id == data.msgId){
					index = i;
					break;
				}
			}

			if(index != -1){
				msgList.splice(index, 1);
			}
		}else{
			alert('操作失败!');
		}
	})
}];

module.exports = ctrl;