var ctrl = ['$scope','$resource', '$state', '$interval','$location', '$cookies', 'API', '$timeout', function($scope, $resource, $state, $interval, $location, $cookies, API, $timeout){
    function isEmpty(value){
        if(value == null || value == undefined || value == ''){
            return true;
        }

        return false;
    }

    var token = $cookies.get('token');
    if(token == null){
        $state.go('login');
        return;
    }

    $scope.errmsg = '数据正在加载中...';
    $scope.editO = null;
    $scope.equipModelOptions = [
        {id:'1',name:'卖给客户'},
        {id:'2',name:'租'},
        {id:'3',name:'抽佣'}
    ];

    var  loadCusts = function() {
        $resource(API.ROOT+'/user/'+token+'/custs/all', {}, {'update': { method:'PUT' }})
            .get(function(resp){
                var code = resp.code;
                var msg = resp.msg;
                var data = resp.result;

                if(code == 100){
                    $scope.custs = data;
                    $scope.errmsg = null;
                }else{
                    $scope.errmsg = msg;
                }
            });
    };

    //加载客户信息
    var  loadEquips = function() {
        $resource(API.ROOT+'/user/'+token+'/equips', {}, {'update': { method:'PUT' }})
            .get(function(resp){
                var code = resp.code;
                var msg = resp.msg;
                var data = resp.result;

                if(code == 100){
                    $scope.equips = data;
                    $scope.errmsg = null;
                }else{
                    $scope.errmsg = msg;
                }
            });
    };

    loadCusts();
    loadEquips();

    $scope.modifyEquip = function (e) {
        if(e.edit == null || e.edit == undefined)
            e.edit = false;

        if(e.edit){//保存
            $resource(API.ROOT+'/user/'+token+'/equip/assign/cust', $scope.editO, {'update': { method:'PUT' }}).save(function(resp){
                var code = resp.code;
                var msg = resp.msg;

                if(code == 100){
                    $scope.errmsg = '分配成功!';
                    $timeout(function () {
                        $scope.errmsg = null;
                    },3000);

                    e.equipId = $scope.editO.equipId;
                    e.custId = $scope.editO.custId;
                    e.deposit = $scope.editO.deposit;
                    e.model = $scope.editO.model;
                    e.rent = $scope.editO.rent;
                    e.edit = false;

                    $scope.editO = null;
                }else{
                    $scope.errmsg = msg;
                }
            });
        }else{
            if($scope.editO != null){
                $scope.errmsg = '有数据正在编辑中，请先保存!';
                return;
            }

            e.edit = !e.edit;
            $scope.editO = {equipId:e.equipId,custId:e.custId,deposit:e.deposit,model:e.model,rent:e.rent};
        }
    }

    $scope.cancel = function (e) {
        e.edit = false;
        $scope.editO = null;
    }

    $scope.getCustName = function (custId) {
        if($scope.custs == null)
            return '';

        var name = '';
        for(var i=0;i<$scope.custs.length;i++){
            var flag = $scope.custs[i].custId == custId;
            if(flag){
                name = $scope.custs[i].name;
                break;
            }
        }
        return name;
    }
    
    $scope.getModelText = function (model) {
        var name = '';
        for(var i=0;i<$scope.equipModelOptions.length;i++){
            var flag = $scope.equipModelOptions[i].id == model;
            if(flag){
                name = $scope.equipModelOptions[i].name;
                break;
            }
        }
        return name;
    }
    
    $scope.isShowRent = function (equip, edit) {
        if(edit && equip.model == '2'){
            return true;
        }
        return false;
    }

    $scope.closeMsg = function () {
        $scope.errmsg = null;
    }
}];

module.exports = ctrl;