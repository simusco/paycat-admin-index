var ctrl = [
    '$scope',
    '$resource',
    '$state',
    '$interval',
    '$cookies',
    '$timeout',
    'Pagination',
    'API',
    '$stateParams',
    function ($scope, $resource, $state, $interval, $cookies, $timeout, Pagination,API, $stateParams) {
        var token = $cookies.get('token');
        if(token == null){
            $state.go('login');
            return;
        }

        var loadEquipStats = function(shopId) {
            $resource(API.ROOT + '/analysis/user/'+token+'/equip', {shopId:shopId}, {'update': { method:'PUT' }}).get({}, function(resp){
                var code = resp.code;
                var msg = resp.msg;
                var data = resp.result;

                if(code == 100){
                    var P = $scope.pageObj = Pagination(data, pagesize);
                    $scope.pageData = P.go(0);
                    $scope.totalPage = P.getPageTotal();

                    $scope.errmsg = null;
                }else{
                    $scope.errmsg = msg;
                }
            });
        };

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

        loadEquipStats($stateParams.shopId);

        $scope.errmsg = '数据正在加载中...';
        var pagesize = 10;
        $scope.go = function (index) {
            var P = $scope.pageObj;
            $scope.pageData = P.go(index);
        }

}];

module.exports = ctrl;