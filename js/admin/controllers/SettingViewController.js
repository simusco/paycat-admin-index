var ctrl = [
'$resource',
'$scope',
'$state',
'$interval',
'$cookies',
'SocketService',
function($resource, $scope, $state, $interval, $cookies, socketService){
	function processEquipData(data){
		var table = [];

		if(data != null){
			//插入添加设备
			if(data[0].equipId != -1){
				data.splice(0, 0, {equipId:-1,icon:'/images/admin/add_equip.png',equipDesc:'添加设备'});
			}

			var row = [];
			for(var i=1;i<=data.length;i++){
				var col = data[i-1];
				if(i != 1){
					col.icon = col.normalIcon;
				}

				row.push(col);
				if(i % 6 == 0){
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

	var token = $cookies.get('token');
	if(token == null){
		$state.go('login');
		return;
	}

	$scope.timeOptions = [
							{key:8,value:'8分钟'},
							{key:10,value:'10分钟'},
							{key:12,value:'12分钟'},
							{key:15,value:'15分钟'}
						];
	$scope.priceOptions = [
							{key:8,value:'8元'},
							{key:10,value:'10元'},
							{key:12,value:'12元'},
							{key:15,value:'15元'}
						];

	var socket = socketService.socket;
	socket.emit('load-equip-infos', {token:token});
	socket.on('load-equip-infos-done', function(data){
		$scope.userEquipsTable = processEquipData(data);
	});

	$scope.maintain = function(equip){
		if(equip.equipId == -1){
			$scope.equip = {equipPriceList:[{time:'',price:''},{time:'',price:''},{time:'',price:''}]};
			$state.go('nav.setting.machine_add');
		}else{
			var Res = $resource('/user/'+token+'/equip/'+equip.equipId, {}, {'update': { method:'PUT' }});
			Res.get({}, function(resp){
				var code = resp.code;
				var msg = resp.msg;
				var data = resp.result;

				if(code == 100){
					$scope.equip = data;
					$state.go('nav.setting.machine_modify');
				}else{
					alert(msg);
				}
			});
		}
	}

	$scope.cancel = function(){
		$state.go('nav.setting.machine');
	}

	$scope.addEquipPrice = function(){
		$scope.equip.equipPriceList.push({time:'',price:''});
	}

	$scope.saveEquipPrice = function(equip){
		alert('equip');
	}

}];

module.exports = ctrl;