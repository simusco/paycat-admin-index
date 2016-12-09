


var ctrl = [
	'$scope',
	'$resource',
	'$state',
	'$rootScope',
	'$cookies',
	'$interval',
	'SocketService',
	function($scope, $resource, $state, $rootScope, $cookies, $interval, socketService){

	var socket = socketService.socket;

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

	function setEquipIcon(col){
		if(col.stateCode == 100 || col.stateCode == 200 || col.stateCode == 600){
			col.icon = col.normalIcon;
		}else if(col.stateCode == 500){
			col.icon = col.errIcon;
		}else if(col.stateCode == 400){
			col.icon = col.unconIcon;
		}
	}

	function processEquipData(data){
		var table = [];

		if(data != null){
			var row = [];
			for(var i=1;i<=data.length;i++){
				var col = data[i-1];
				setEquipIcon(col);
				col.surplusSecDesc = secTohms(col.surplusSec);

				row.push(col);
				if(i % 5 == 0){
					table.push(row);
					row = [];
				}
			}

			if(row.length > 0){
				table.push(row);
				row = [];
			}
		}

		return table;
	}

	function analysis(userEquipsTable){
		var table = userEquipsTable;
		var usingCount = 0;
		var ableCount = 0;
		var onlineCount = 0;

		for(var i=0;i<table.length;i++){
			for(var j=0;j<table[i].length;j++){
				var sc = table[i][j].stateCode;
				if(table[i][j].surplusSec > 1){
					usingCount++;
				}

				if(sc == 100){
					ableCount++;
				}
			}
		}

		onlineCount = ableCount + usingCount;

		return {
			usingCount:usingCount,
			ableCount:ableCount,
			onlineCount:onlineCount
		};
	}

	//加载设备完成
	socket.on('load-user-equip-done', function(data){
		console.log(data);
		$scope.userEquipsTable = processEquipData(data);
		$scope.analysis = analysis($scope.userEquipsTable);
	});

	//设备信息发生变化
	socket.on('user-equip-changed', function(equip){
		console.log('数据改变');
		console.log(equip);

		var table = $scope.userEquipsTable;
		for(var i=0;i<table.length;i++){
			for(var j=0;j<table[i].length;j++){
				var col = table[i][j];
				if(equip.equipId == col.equipId){
					console.log('发现数据变了');
					col.surplusSec = equip.surplusSec;
					col.useTime = equip.useTime;
					col.useSec = equip.useSec;
					col.lastTickTime = equip.lastTickTime;
					col.stateCode = equip.stateCode;
					col.stateDesc = equip.stateDesc;

					setEquipIcon(col);

					if(col.surplusSec >= 1)
						col.surplusSecDesc = secTohms(col.surplusSec);

					break;
				}
			}
		}

		$scope.analysis = analysis(table);
	});

	//计算设备剩余时间和统计使用数据
	$interval(function(){
		var table = $scope.userEquipsTable;
		for(var i=0;table != null && i<table.length;i++){
			for(var j=0;j<table[i].length;j++){
				var col = table[i][j];
				if(col.surplusSec - 1 > 0){
					col.surplusSec -= 1;
					col.surplusSecDesc = secTohms(col.surplusSec);
				}
			}
		}

		if(table != null){
			$scope.analysis = analysis(table);
		}
	},1000);
}];

module.exports = ctrl;