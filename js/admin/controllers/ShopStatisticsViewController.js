var ctrl = [
'$scope',
'$resource',
'$state',
'$interval',
'$cookies',
'$timeout',
'Pagination',
'API',
function ($scope, $resource, $state, $interval, $cookies, $timeout, Pagination, API) {
    var token = $cookies.get('token');
    if(token == null){
        $state.go('login');
        return;
    }
    var pagesize = 5;
    $scope.errmsg = '数据正在加载中...';

    $resource(API.ROOT + '/analysis/user/'+token+'/shop', {}, {'update': { method:'PUT' }}).get({}, function(resp){
        var code = resp.code;
        var msg = resp.msg;
        var data = resp.result;

        if(code == 100){
            var todayTotal = 0;
            var monthTotal = 0;

            for(var i=0;i<data.length;i++){
                if(data[i].dprice != null){
                    todayTotal +=data[i].dprice;
                }

                if(data[i].mprice != null){
                    monthTotal +=data[i].mprice;
                }
            }

            var P = $scope.pageObj = Pagination(data, pagesize);
            $scope.pageData = P.go(0);
            $scope.totalPage = P.getPageTotal();

            $scope.todayTotal = todayTotal;
            $scope.monthTotal = monthTotal;
            $scope.errmsg = null;
        }else{
            $scope.errmsg = msg;
        }
    });

    $scope.go = function (index) {
        var P = $scope.pageObj;
        $scope.pageData = P.go(index);
    }

    $scope.showEquipStatsOfShop = function (shopId) {
        console.log('shopId:'+shopId);
        var roleId = $cookies.get('roleId');
        if(roleId == 1){
            $state.go('customer.statistics.shop.equip',{shopId:shopId});
        }else if(roleId == 2){
            $state.go('shopper.statistics.shop.equip',{shopId:shopId});
        }
    }
}];

module.exports = ctrl;