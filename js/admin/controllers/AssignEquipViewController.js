

var ctrl = [
'$scope',
'$resource',
'$state',
'$interval',
'$cookies',
'$timeout',
'Pagination',
'API',
function($scope, $resource, $state, $interval, $cookies,$timeout,Pagination, API){
    function isEmpty(value){
        if(value == null || value == undefined || value == ''){
            return true;
        }

        return false;
    }


    var token = $cookies.get('token');
    var equip = $scope.equip = {};
    var selectedEquip = {};
    var equipQuery = $scope.equipQuery = {};
    var pagesize = 50;

    if(token == null){
        $state.go('login');
        return;
    }

    $scope.timeOptions = (function () {
        var arr = [];
        for(var i=0;i<90;i++){
            arr.push({key:i+1,value:(i+1)+'分钟'});
        }
        return arr;
    })();

    $scope.priceOptions = (function () {
        var arr = [];
        for(var i=0;i<90;i++){
            arr.push({key:i+1,value:(i+1)+'元'});
        }
        return arr;
    })();

    $scope.stateOptions = (function () {
        return [
            {stateCode:100,stateDesc:"空闲"},
            {stateCode:500,stateDesc:"设备异常"},
            {stateCode:400,stateDesc:"未连接"},
            {stateCode:200,stateDesc:"使用中"}
        ];
    })();

    $scope.shopperCanModOptions = (function () {
        return [
            {id:'Y',name:"能"},
            {id:'N',name:"不能"}
        ];
    })();

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

    $resource(API.ROOT+'/user/'+token+'/price/options', {}, {'update': { method:'PUT' }}).get({}, function(resp){
        var code = resp.code;
        var msg = resp.msg;
        var data = resp.result;

        if(code == 100){
            $scope.shopPrices = data;
        }else{
            $scope.errmsg = msg;
        }
    });

    var queryEquips = $scope.queryEquips = function(){
        $resource(API.ROOT+'/user/'+token+'/equips', equipQuery, {'update': { method:'PUT' }})
            .get(function(resp){
                var code = resp.code;
                var msg = resp.msg;
                var data = resp.result;

                if(code == 100){
                    for(var i=0;i<data.length;i++){
                        data[i].showAssignUI = false;
                    }

                    var P = $scope.pageObj = Pagination(data, pagesize);
                    $scope.pageData = P.go(0);
                    $scope.totalPage = P.getPageTotal();
                }else{
                    $scope.errmsg = msg;
                }
            });
    };

    $scope.assign = function (equip) {
        var shopperCanMod = equip.shopperCanMod;
        if(shopperCanMod != 'Y'){
            var roleId = $cookies.get('roleId');
            if(roleId == 1){//商户

            }else{
                $scope.errmsg = '此设备禁止修改价格';
                return;
            }
        }

        var el = $scope.pageData;
        if(el != null){
            for(var i=0;i<el.length;i++){
                if(el[i].showAssignUI){
                    el[i].showAssignUI = false;
                }
            }
        }

        $resource(API.ROOT+'/user/'+token+'/equip/'+equip.equipId, {}, {'update': { method:'PUT' }})
            .get(function(resp){
                var code = resp.code;
                var msg = resp.msg;
                var data = resp.result;

                if(code == 100){
                    $scope.equip = data;

                    //临时保存修改设备数据行
                    selectedEquip = equip;
                    selectedEquip.showAssignUI = true;

                    $scope.showPrices();
                }else{
                    $scope.errmsg = msg;
                }
            });
    }

    $scope.saveAssignV2 = function () {
        var modifyObj = $scope.equip;

        if(isEmpty(modifyObj.pricePlanId)){
            $scope.errmsg = '请选择价格计划!';
            return;
        }

        $resource(API.ROOT+'/v2/user/'+token+'/equip/'+modifyObj.id, modifyObj, {'update': { method:'PUT' }})
            .save(function (resp) {
                var code = resp.code;
                var msg = resp.msg;
                var data = resp.result;

                if(code == 100){
                    $scope.errmsg = '保存成功!';
                    $timeout(function () {
                        $scope.errmsg = null;
                    },3000);

                    //刷新修改行
                    selectedEquip.shopId = data.shopId;
                    selectedEquip.shopName = data.shopName;
                    selectedEquip.pricePlanId = data.pricePlanId;
                    selectedEquip.priceName = data.priceName;
                    selectedEquip.address = data.address;

                    //关闭修改界面
                    selectedEquip.showAssignUI = false;
                }else{
                    $scope.errmsg = msg;
                }
            });
    }

    $scope.closeMsg = function () {
        $scope.errmsg = null;
    }

    $scope.clearQuery = function () {
        equipQuery.equipId = null;
        equipQuery.address = null;
        equipQuery.shopId = null;
    }

    $scope.go = function (index) {
        var P = $scope.pageObj;
        $scope.pageData = P.go(index);
    }

    //加载
    queryEquips();

    $scope.showPrices = function () {
        if($scope.equip.pricePlanId == null || $scope.equip.pricePlanId == ""){
            $scope.prices = [];
            return;
        }

        for(var i=0;i<$scope.shopPrices.length;i++){
            var sp = $scope.shopPrices[i];

            if(sp.id == $scope.equip.pricePlanId){
                $scope.prices = [];

                if(sp.type == 'TIME_PRICE'){
                    $scope.prices = eval(sp.extra1);
                }

                break;
            }
        }
    }

    $scope.cancel = function () {
        selectedEquip.showAssignUI = false;
        selectedEquip = null;
    }

    $scope.getEquipStateIcon = function(col){
        var url = null;
        if(col.stateCode == 100 || col.stateCode == 200 || col.stateCode == 600){
            url = col.normalIcon;
        }else if(col.stateCode == 500){
            url = col.errIcon;
        }else if(col.stateCode == 400){
            url = col.unconIcon;
        }
        return url;
    }

    $scope.isShowShopperCanMod = function () {
        var roleId = $cookies.get('roleId');
        if(roleId == 1){//商户
            return true;
        }
        return false;
    }
}];

export default ctrl;