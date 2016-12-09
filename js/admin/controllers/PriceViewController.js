var ctrl = [
'$scope',
'$resource',
'$state',
'$interval',
'$cookies',
'$timeout',
'Pagination',
'API',
function($scope, $resource, $state, $interval, $cookies,$timeout,Pagination,API){

    function isEmpty(value){
        if(value == null || value == undefined || value == ''){
            return true;
        }

        return false;
    }

    function convertPriceToObj(data) {
        for(var i=0;i< data.length;i++){
            var sp = data[i];
            if(sp.type == 'TIME_PRICE'){
                sp.prices = eval(sp.extra1);
            }
        }
    }

    function initParams() {
        return {name:null,prices:[{subject:null,description:null,time:null,price:null}]};
    }

    var token = $cookies.get('token');
    var params = $scope.params = initParams();
    var editPrice = {};
    $scope.edit = false;

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

    $resource(API.ROOT+'/user/'+token+'/price', {}, {'update': { method:'PUT' }}).get({}, function(resp){
        var code = resp.code;
        var msg = resp.msg;
        var data = resp.result;

        if(code == 100){
            if(data == null) {
                return;
            }

            convertPriceToObj(data);
            $scope.shopPrices = data;
        }else{
            $scope.errmsg = msg;
        }
    });

    $scope.closeMsg = function () {
        $scope.errmsg = null;
    }

    $scope.addPrice = function () {
        params.prices.push({subject:null,description:null,time:null,price:null});
    }

    $scope.delPrice = function (price) {
        var index = params.prices.indexOf(price);
        if(index == -1){
            return;
        }

        params.prices.splice(index,1);
    }

    $scope.savePrice = function () {

        if(params.name == null || params.name == ''){
            $scope.errmsg = '套餐名称未填写';
            return;
        }

        if(params.prices.length == 0){
            $scope.errmsg = '未添加任何价格';
            return;
        }

        var subject = [];
        var description = [];
        var time = [];
        var price = [];

        for(var i = 0;i<params.prices.length; i++){
            subject.push(params.prices[i].subject);
            description.push(params.prices[i].description);
            time.push(params.prices[i].time);
            price.push(params.prices[i].price);
        }

        params.subject = subject;
        params.description = description;
        params.time = time;
        params.price = price;

        if($scope.edit){
            $resource(API.ROOT+'/user/'+token+'/price/'+params.id, params, {'update': { method:'PUT' }})
                .save(function (resp) {
                    var code = resp.code;
                    var msg = resp.msg;
                    var data = resp.result;

                    if(code == 100){
                        $scope.errmsg = '修改成功!';
                        $timeout(function () {
                            $scope.errmsg = null;
                        },3000);

                        convertPriceToObj([data]);
                        editPrice.name = data.name;
                        editPrice.prices = data.prices;

                        //重新设置参数
                        $scope.reset();
                    }else{
                        $scope.errmsg = msg;
                    }
                });
        }else{
            $resource(API.ROOT+'/user/'+token+'/price', params, {'update': { method:'PUT' }})
                .save(function (resp) {
                    var code = resp.code;
                    var msg = resp.msg;
                    var data = resp.result;

                    if(code == 100){
                        $scope.errmsg = '保存成功!';
                        $timeout(function () {
                            $scope.errmsg = null;
                        },3000);

                        if($scope.shopPrices == null)
                            $scope.shopPrices = [];

                        //转换结果JSON到OBJ
                        convertPriceToObj([data]);
                        $scope.shopPrices.push(data);

                        //重新设置参数
                        $scope.reset();
                    }else{
                        $scope.errmsg = msg;
                    }
                });
        }
    }

    $scope.editPrice = function (shopPrice) {
        $scope.edit = true;
        editPrice = shopPrice;

        //为了copy一份，有现成js
        params =  $scope.params = {
            id:editPrice.id,
            name:editPrice.name,
            prices:(function () {
                var arr = [];
                for(var i = 0 ;i< editPrice.prices.length; i++){
                    arr.push({
                        subject:editPrice.prices[i].subject,
                        description:editPrice.prices[i].description,
                        time:editPrice.prices[i].time,
                        price:editPrice.prices[i].price
                    })
                }
                return arr;
            })()
        };
    }

    $scope.reset = function () {
        $scope.edit = false;
        $scope.errmsg = null;

        params = $scope.params = initParams();
        editPrice = null;
    }

    $scope.deletePrice = function (shopPrice) {
        $resource(API.ROOT+'/user/'+token+'/price/'+shopPrice.id + '/del', {}, {'update': { method:'PUT' }})
            .save(function (resp) {
                var code = resp.code;
                var msg = resp.msg;

                if(code == 100){
                    var shopPrices = $scope.shopPrices;
                    for(var i=0;i<shopPrices.length;i++){
                        if(shopPrices[i].id == shopPrice.id){
                            shopPrices.splice(i, 1);
                            break;
                        }
                    }
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