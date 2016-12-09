var angular = require('angular');
var uiRouter = require('angular-ui-router');
var angularResource = require('angular-resource');
var angularCookies = require('angular-cookies');
var socketio = require('socket.io-client');

var MsgViewController = require('./controllers/MsgViewController');
var LoginViewController = require('./controllers/LoginViewController');
var EquipViewController = require('./controllers/EquipViewController');
var SignupViewController = require('./controllers/SignupViewController');
var IndexViewController = require('./controllers/IndexViewController');
var UserViewController = require('./controllers/UserViewController');
var SettingViewController = require('./controllers/SettingViewController');
var ShopViewController = require('./controllers/ShopViewController');
var AssignEquipViewController = require('./controllers/AssignEquipViewController');
var ShopStatisticsViewController = require('./controllers/ShopStatisticsViewController');
var EquipStatisticsViewController = require('./controllers/EquipStatisticsViewController');
var CustViewController = require('./controllers/CustViewController');
var PriceViewController = require('./controllers/PriceViewController');
var WaiterViewController = require('./controllers/WaiterViewController');
var MantainEquipViewController = require('./controllers/MantainEquipViewController');
var MantainCustViewController = require('./controllers/MantainCustViewController');

var pa = angular.module('PaycatAdmin',['ui.router','ngResource','ngCookies']);

pa.service('API',function () {
    return {
        ROOT:'http://www.shouyinmao.cn'
    }
});
pa.service('Pagination',function () {
    var Pagination = function (data, pagesize) {
        var _pagetotal = parseInt(data.length /  pagesize) + ((data.length %  pagesize) > 0 ?  1 : 0);

        return {
            getPageTotal:function () {
                var t = [];
                for(var i=0;i<_pagetotal;i++){
                    t.push(i);
                }
                return t;
            },
            go:function(index){
                if(index < 0){
                    index = 0;
                }

                if(index > _pagetotal){
                    index = _pagetotal;
                }

                var s = 0;
                var e = 0;
                if(index != 0){
                    s = index * pagesize;
                }
                e = s + pagesize ;

                return data.slice(s, e);
            }
        }
    };
    return Pagination;
});

pa.service('SocketService', ['$rootScope', '$cookies', function($rootScope, $cookies){
    var _socket = (function(){
        var sc = socketio.connect('http://www.shouyinmao.cn:8888');
        return {
            on: function(eventName, callback) {
                sc.on(eventName, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        if (callback) {
                            callback.apply(sc, args);
                        }
                    });
                });
            },
            emit: function(eventName, data, callback) {
                sc.emit(eventName, data, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        if (callback) {
                            callback.apply(sc, args);
                        }
                    });
                })
            }
        };
    })();

    var token = $cookies.get('token');
    if(token != null){
        _socket.emit('regist-socket', {token: token});
    }

    return {socket : _socket};
}]);

pa.config(function($stateProvider, $urlRouterProvider, $cookiesProvider) {
    $urlRouterProvider
        .when("", "/login")
        .when("/customer/mantain", "/customer/mantain/shop")
        .when("/customer/statistics", "/customer/statistics/shop")
        .when("/customer/setting", "/customer/setting/user_info")
        .when("/shopper/statistics", "/shopper/statistics/shop")
        .when("/shopper/mantain", "/shopper/mantain/shop")
        .when("/admin/mantain", "/admin/mantain/equip")
        .when("/admin/statistics", "/admin/statistics/cust");

    $stateProvider
        .state('login', {url: "/login", templateUrl: "views/login.html"})
        .state('signup', {url: "/signup",templateUrl: "views/signup.html"})

        //服务员
        .state('waiter', {url: "/waiter",templateUrl: "views/waiter/nav.html"})
        .state('waiter.main', {url: "/main",templateUrl: "views/waiter/main.html"})
        .state('waiter.help', {url: "/help",templateUrl: "views/waiter/help.html"})

        //商户
        .state('customer', {url: "/customer",templateUrl: "views/customer/nav.html"})
        .state('customer.mantain', {url: "/mantain",templateUrl: "views/customer/mantain.html"})
        .state('customer.mantain.shop', {url: "/shop",templateUrl: "views/customer/shop.html"})
        .state('customer.mantain.assign_machine_shop', {url: "/shop_assign_machine",templateUrl: "views/customer/shop_assign_machine.html"})
        .state('customer.mantain.price', {url: "/price",templateUrl: "views/customer/price.html"})
        .state('customer.mantain.waiter', {url: "/waiter",templateUrl: "views/customer/waiter.html"})
        .state('customer.statistics', {url: "/statistics",templateUrl: "views/customer/statistics.html"})
        .state('customer.statistics.shop', {url: "/shop",templateUrl: "views/customer/shop_statistics.html"})
        .state('customer.statistics.shop.equip', {url: "/:shopId/equip",templateUrl: "views/customer/shop_equips_stats.html",params:{shopId:null}})
        .state('customer.statistics.equip', {url: "/equip",templateUrl: "views/customer/equip_statistics.html"})
        .state('customer.setting', {url: "/setting",templateUrl: "views/customer/setting.html"})
        .state('customer.setting.user_info', {url: "/user_info",templateUrl: "views/customer/cust_info.html"})
        .state('customer.setting.user_financial', {url: "/user_financial",templateUrl: "views/customer/cust_financial.html"})
        .state('customer.help', {url: "/help",templateUrl: "views/customer/help.html"})

        //店铺管理员
        .state('shopper', {url: "/shopper",templateUrl: "views/shopper/nav.html"})
        .state('shopper.mantain', {url: "/mantain",templateUrl: "views/shopper/mantain.html"})
        .state('shopper.mantain.shop', {url: "/shop",templateUrl: "views/customer/shop.html"})
        .state('shopper.mantain.assign_machine_shop', {url: "/shop_assign_machine",templateUrl: "views/customer/shop_assign_machine.html"})
        .state('shopper.mantain.price', {url: "/price",templateUrl: "views/customer/price.html"})
        .state('shopper.mantain.waiter', {url: "/waiter",templateUrl: "views/customer/waiter.html"})
        .state('shopper.statistics', {url: "/statistics",templateUrl: "views/shopper/statistics.html"})
        .state('shopper.statistics.shop', {url: "/shop",templateUrl: "views/customer/shop_statistics.html"})
        .state('shopper.statistics.shop.equip', {url: "/:shopId/equip",templateUrl: "views/customer/shop_equips_stats.html",params:{shopId:null}})
        .state('shopper.statistics.equip', {url: "/equip",templateUrl: "views/customer/equip_statistics.html"})
        .state('shopper.help', {url: "/help",templateUrl: "views/customer/help.html"})

        //管理员
        .state('admin', {url: "/admin",templateUrl: "views/admin/nav.html"})
        .state('admin.mantain', {url: "/mantain",templateUrl: "views/admin/mantain.html"})
        .state('admin.mantain.cust', {url: "/cust",templateUrl: "views/admin/mantain_cust.html"})
        .state('admin.mantain.cust.edit',
            {
                url: "/edit",
                templateUrl: "views/admin/modify_cust.html",
                params:{
                    custId:null,
                    name:null,
                    address:null,
                    telephone:null,
                    phone:null,
                    payee:null,
                    bank:null,
                    cardNo:null,
                    bankOfDeposit:null
                }
            })
        .state('admin.mantain.equip', {url: "/equip",templateUrl: "views/admin/mantain_equip.html"})
        .state('admin.statistics', {url: "/statistics",templateUrl: "views/admin/statistics.html"})
        .state('admin.statistics.cust', {url: "/cust",templateUrl: "views/admin/cust_statistics.html"});
});

pa.controller('IndexViewController', IndexViewController);
pa.controller('LoginViewController', LoginViewController);
pa.controller('SignupViewController', SignupViewController);
pa.controller('MsgViewController', MsgViewController);
pa.controller('EquipViewController', EquipViewController);
pa.controller('UserViewController', UserViewController);
pa.controller('SettingViewController', SettingViewController);
pa.controller('ShopViewController', ShopViewController);
pa.controller('AssignEquipViewController', AssignEquipViewController);
pa.controller('ShopStatisticsViewController', ShopStatisticsViewController);
pa.controller('EquipStatisticsViewController', EquipStatisticsViewController);
pa.controller('CustViewController',CustViewController);
pa.controller('PriceViewController',PriceViewController);
pa.controller('WaiterViewController',WaiterViewController);
pa.controller('MantainEquipViewController',MantainEquipViewController);
pa.controller('MantainCustViewController',MantainCustViewController);