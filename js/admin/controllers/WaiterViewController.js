var ctrl = [
'$scope',
'$cookies',
'API',
'$resource',
'$state',
'$timeout',
function($scope, $cookies, API, $resource, $state, $timeout){

    var token = $cookies.get('token');
    if(token == null){
        $state.go('login');
        return;
    }

    function validate(nw) {
        if(nw.id == null){
            $scope.errmsg = '帐号必须填写';
            return false;
        }

        if(nw.shopId == null){
            $scope.errmsg = '请选择所属店铺';
            return false;
        }

        if(nw.name == null){
            $scope.errmsg = '名称需要填写';
            return false;
        }

        if(nw.password == null){
            $scope.errmsg = '密码必须填写';
            return false;
        }

        if(nw.roleId == null){
            $scope.errmsg = '必须选择角色';
            return false;
        }

        return true;
    }

    $resource(API.ROOT+'/user/'+token+'/shop', {}, {'update': { method:'PUT' }}).get({}, function(resp){
        var code = resp.code;
        var msg = resp.msg;
        var data = resp.result;

        if(code == 100){
            $scope.shopList = data;
        }else{
            $scope.errmsg = msg;
        }
    });

    $scope.getShopName = function (shopId) {
        if($scope.shopList == null)
            return '';

        var shopName = '';
        for(var i=0;i<$scope.shopList.length;i++){
            var flag = $scope.shopList[i].shopId == shopId;
            if(flag){
                shopName = $scope.shopList[i].shopName;
                break;
            }
        }
        return shopName;
    }

    $scope.editO = {};
    $scope.newWaiter = {};
    $scope.roles = [
        {roleId:'2',roleName:'店铺管理元'},
        {roleId:'4',roleName:'服务员'}
    ];
    (function () {
        $resource(API.ROOT+'/shop/user/'+token+'/users', {}, {'update': { method:'PUT' }}).get({}, function(resp){
            var code = resp.code;
            var msg = resp.msg;
            var data = resp.result;

            if(code == 100){
                $scope.waiters = data;
            }else{
                $scope.errmsg = msg;
            }
        });
    })();
    $scope.editWaiter = function (waiter) {
        if(waiter.edit == null || waiter.edit == undefined)
            waiter.edit = false;

        if(waiter.edit){//保存
            if(!validate($scope.editO)){
                return;
            }

            $resource(API.ROOT+'/user/'+token+'/update', $scope.editO, {'update': { method:'PUT' }}).save(function(resp){
                var code = resp.code;
                var msg = resp.msg;

                if(code == 100){
                    $scope.errmsg = '修改成功!';
                    $timeout(function () {
                        $scope.errmsg = null;
                    },3000);

                    waiter.shopId = $scope.editO.shopId;
                    waiter.name = $scope.editO.name;
                    waiter.id = $scope.editO.id;
                    waiter.password = $scope.editO.password;
                    waiter.roleId = $scope.editO.roleId;
                    $scope.editO = {};
                    waiter.edit = false;
                }else{
                    $scope.errmsg = msg;
                }
            });
        }else{
            waiter.edit = !waiter.edit;
            $scope.editO = {
                shopId:waiter.shopId,
                name:waiter.name,
                id:waiter.id,
                password:waiter.password,
                roleId:waiter.roleId};
        }
    }
    $scope.getRoleName = function (roleId) {
        var roleName = '';
        for(var i=0;i<$scope.roles.length;i++){
            var flag = $scope.roles[i].roleId == roleId;
            if(flag){
                roleName = $scope.roles[i].roleName;
                break;
            }
        }

        return roleName;
    }
    $scope.cancel = function (waiter) {
        waiter.edit = false;
        $scope.editO = {};
    }
    $scope.saveWaiter = function () {
        var nw = $scope.newWaiter;
        if(!validate(nw)){
            return;
        }

        $resource(API.ROOT+'/user/'+token+'/create', nw, {'update': { method:'PUT' }}).save(function(resp){
            var code = resp.code;
            var msg = resp.msg;
            var data = resp.result;

            if(code == 100){
                $scope.errmsg = '保存成功!';
                $timeout(function () {
                    $scope.errmsg = null;
                },3000);

                $scope.waiters.push(data);
                $scope.newWaiter = {};
            }else{
                $scope.errmsg = msg;
            }
        });
    }
    $scope.closeMsg = function () {
        $scope.errmsg = null;
    }
}];

module.exports = ctrl;