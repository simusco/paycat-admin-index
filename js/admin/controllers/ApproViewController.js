export  default  [
    '$scope',
    '$resource',
    '$state',
    '$interval',
    '$cookies',
    '$timeout',
    'Pagination',
    'API',
    function($scope, $resource, $state, $interval, $cookies,$timeout,Pagination, API){

        const token = $cookies.get('token');
        $scope.errmsg = '数据正在加载中....!';

        $resource(API.ROOT+'/appro', {token}, {'update': { method:'PUT' }}).get({}, function(resp){
            $scope.errmsg = null;

            const code = resp.code;
            const msg = resp.msg;
            const data = resp.result;
            if(code == 100){
                $scope.appros = data;
            }else{
                $scope.errmsg = msg;
            }
        });

        $scope.appro = function (appro) {
            $resource(API.ROOT+'/appro', {token,shopId:appro.shopId}, {'update': { method:'PUT' }})
                .save(function (resp) {
                    const code = resp.code;
                    const msg = resp.msg;
                    const data = resp.result;

                    if(code == 100){
                        $scope.errmsg = '操作成功!';
                        $timeout(function () {
                            $scope.errmsg = null;
                        },3000);

                        let index = -1;
                        for(var x = 0;x < $scope.appros.length;x++){
                            if($scope.appros[x].shopId == appro.shopId){
                                index = x;
                            }
                        }

                        if(index != -1){
                            $scope.appros.splice(index, 1);
                        }
                    }else{
                        $scope.errmsg = msg;
                    }
                });
        }
        
}];