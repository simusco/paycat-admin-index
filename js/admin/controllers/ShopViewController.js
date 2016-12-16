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
    if(token == null){
        $state.go('login');
        return;
    }

    var shop = $scope.shop = {};
    $scope.isModifyShop = false;
    var pagesize = 5;

    //加载店铺列表信息
   function loadShops() {
       $resource(API.ROOT+'/user/'+token+'/shop', {}, {'update': { method:'PUT' }})
           .get(function(resp){
               var code = resp.code;
               var msg = resp.msg;
               var data = resp.result;

               if(code == 100){
                   var P = $scope.pageObj = Pagination(data, pagesize);
                   $scope.pageData = P.go(0);
                   $scope.totalPage = P.getPageTotal();
               }else{
                   $scope.errmsg = msg;
               }
           });
   }

    loadShops();

    $scope.saveShop = function () {
        if(isEmpty(shop.shopName)){
            $scope.errmsg = '店铺名称必须填写!';
            return;
        }

        if(isEmpty(shop.address)){
            $scope.errmsg = '店铺地址必须填写';
            return;
        }

        $resource(API.ROOT+'/user/'+token+'/shop', shop, {'update': { method:'PUT' }})
            .save(function (resp) {
                var code = resp.code;
                var msg = resp.msg;

                if(code == 100){
                    $scope.errmsg = '添加商店成功!';
                    $timeout(function () {
                        $scope.errmsg = null;
                    },3000);

                    loadShops();
                }else{
                    $scope.errmsg  = msg;
                }
            });
    }

    $scope.editShop = function (shop) {
        $scope.isModifyShop = true;

        var s = {};
        s.shopId = shop.shopId;
        s.address = shop.address;
        s.shopName = shop.shopName;

        $scope.shop = s;
    }

    $scope.modifyShop = function(){
        var s =  $scope.shop;
        if(isEmpty(s.shopName)){
            $scope.errmsg = '店铺名称必须填写!';
            return;
        }

        if(isEmpty(s.address)){
            $scope.errmsg = '店铺地址必须填写';
            return;
        }

        $resource(API.ROOT+'/user/'+token+'/shop/update', s, {'update': { method:'PUT' }})
            .save(function (resp) {
                var code = resp.code;
                var msg = resp.msg;

                if(code == 100){
                    var sl = $scope.pageData;
                    for(var i=0;i<sl.length;i++){
                        var t = sl[i];
                        if(t.shopId == s.shopId){
                            t.address = s.address;
                            t.shopName = s.shopName;
                            break;
                        }
                    }

                    $scope.errmsg = '修改成功!';
                    $timeout(function () {
                        $scope.errmsg = null;
                    },3000);
                }else{
                    $scope.errmsg = msg;
                }
            });
    }

    $scope.logoff = function () {

    }

    $scope.reset = function (shop) {
        $scope.shop = {};
        $scope.isModifyShop = false;
        $scope.errmsg = null;
    }

    $scope.closeMsg = function () {
        $scope.errmsg = null;
    }

    $scope.go = function (index) {
        var P = $scope.pageObj;
        $scope.pageData = P.go(index);
    }
}];

export default ctrl;