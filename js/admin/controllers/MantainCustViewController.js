var ctrl = ['$scope','$resource', '$state', '$interval','$location', '$cookies', 'API', '$timeout', function($scope, $resource, $state, $interval, $location, $cookies, API, $timeout){
    var token = $cookies.get('token');
    if(token == null){
        $state.go('login');
        return;
    }

    var  loadCusts = function() {
        $resource(API.ROOT+'/user/'+token+'/custs/all', {}, {'update': { method:'PUT' }})
            .get(function(resp){
                var code = resp.code;
                var msg = resp.msg;
                var data = resp.result;

                if(code == 100){
                    if(data == null) data = [];
                    $scope.custs = data;
                    $scope.errmsg = null;
                }else{
                    $scope.errmsg = msg;

                }
            });
    };

    loadCusts();

    $scope.edit = false;
    $scope.editCust = function (c) {
        $scope.editORef = c;
        $scope.edit = true;
        $resource(API.ROOT+'/user/'+token+'/cust/'+c.custId, {} , {'update': { method:'PUT' }})
            .get(function (resp) {
                var code = resp.code;
                var msg = resp.msg;

                if(code == 100){
                    $scope.editO = resp.result;
                }else{
                    $scope.errmsg = msg;
                }
            });
    }

    $scope.mantainCust = function () {
        if($scope.editO.custId == null){
            //add new cust
            $resource(API.ROOT+'/cust/'+token+'/all/save', $scope.editO , {'update': { method:'PUT' }})
                .save(function(resp){
                    var code = resp.code;
                    var msg = resp.msg;
                    var data = resp.result;

                    if(code == 100){
                        $scope.errmsg = '保存成功!';
                        $timeout(function () {
                            $scope.errmsg = null;
                        },3000);

                        $scope.custs.push(data);
                        $scope.cancel();
                    }else{
                        $scope.errmsg = msg;
                    }
                });
        }else{
            //update cust
            $resource(API.ROOT+'/cust/'+token+'/all/update', $scope.editO , {'update': { method:'PUT' }})
                .save(function(resp){
                    var code = resp.code;
                    var msg = resp.msg;

                    if(code == 100){
                        $scope.errmsg = '更新成功!';
                        $timeout(function () {
                            $scope.errmsg = null;
                        },3000);
                        freshEditRow();
                        $scope.cancel();
                    }else{
                        $scope.errmsg = msg;
                    }
                });
        }
    }

    $scope.cancel = function () {
        $scope.edit = false;
        $scope.editO = null;
        $scope.editORef = null;
    }

    $scope.closeMsg = function () {
        $scope.errmsg = null;
    }

    $scope.addCust = function () {
        $scope.edit = true;
        $scope.editO = {};
    }

    function freshEditRow() {
        var ref = $scope.editORef;
        ref.name = $scope.editO.name;
        ref.address = $scope.editO.address;
        ref.telephone = $scope.editO.telephone;
        ref.phone = $scope.editO.phone;
        ref.userId = $scope.editO.userId;
        ref.pwd1 = $scope.editO.pwd1;
        ref.pwd2 = $scope.editO.pwd2;
        ref.payee = $scope.editO.payee;
        ref.bank =$scope.editO.bank;
        ref.cardNo =$scope.editO.cardNo;
        ref.bankOfDeposit =$scope.editO.bankOfDeposit;
    }
}];

export default ctrl;