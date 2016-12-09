var ctrl = [
'$scope',
'$resource',
'$state',
'$interval',
'$cookies',
'$timeout',
'API',
function ($scope, $resource, $state, $interval, $cookies, $timeout, API) {
    var token = $cookies.get('token');
    if(token == null){
        $state.go('login');
        return;
    }

    $scope.errmsg = '数据正在加载中...';

    $resource(API.ROOT+'/user/curr/'+token+'/cust', {}, {'update': { method:'PUT' }}).get({}, function(resp){
        var code = resp.code;
        var msg = resp.msg;
        var data = resp.result;

        if(code == 100){
            data.pwd1 = data.user.password;
            data.pwd2 = data.user.password;

            $scope.cust = data;
            $scope.errmsg = null;
        }else{
            $scope.errmsg = msg;
        }
    });

    $scope.modifyUserInfo = function () {
        var cust = $scope.cust;

        $resource(API.ROOT+'/cust/'+token+'/info', cust, {'update': { method:'PUT' }})
            .save(function(resp){
                var code = resp.code;
                var msg = resp.msg;
                var data = resp.result;

                if(code == 100){
                    $scope.errmsg = '修改成功!';
                    $timeout(function () {
                        $scope.errmsg = null;
                    },3000);
                }else{
                    $scope.errmsg = msg;
                }
            });
    }

    $scope.modifyFinancial = function () {
        var financial = {
            payee: $scope.cust.payee,
            bank:$scope.cust.bank,
            cardNo:$scope.cust.cardNo,
            bankOfDeposit:$scope.cust.bankOfDeposit
        };

        $resource(API.ROOT+'/cust/'+token+'/financial', financial, {'update': { method:'PUT' }})
            .save(function(resp){
                var code = resp.code;
                var msg = resp.msg;
                var data = resp.result;

                if(code == 100){
                    $scope.errmsg = '修改成功!';
                    $timeout(function () {
                        $scope.errmsg = null;
                    },3000);
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