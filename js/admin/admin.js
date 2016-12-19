import angular from 'angular';
import $ from 'jquery';

import uiRouter from 'angular-ui-router';
import angularResource from 'angular-resource';
import angularCookies from 'angular-cookies';
import socketio from 'socket.io-client';

import MsgViewController from './controllers/MsgViewController';
import LoginViewController from './controllers/LoginViewController';
import EquipViewController from './controllers/EquipViewController';
import SignupViewController from './controllers/SignupViewController';
import IndexViewController from './controllers/IndexViewController';
import UserViewController from './controllers/UserViewController';
import SettingViewController from './controllers/SettingViewController';
import ShopViewController from './controllers/ShopViewController';
import AssignEquipViewController from './controllers/AssignEquipViewController';
import ShopStatisticsViewController from './controllers/ShopStatisticsViewController';
import EquipStatisticsViewController from './controllers/EquipStatisticsViewController';
import CustViewController from './controllers/CustViewController';
import PriceViewController from './controllers/PriceViewController';
import WaiterViewController from './controllers/WaiterViewController';
import MantainEquipViewController from './controllers/MantainEquipViewController';
import MantainCustViewController from './controllers/MantainCustViewController';
import ApproViewController from './controllers/ApproViewController';

var pa = angular.module('PaycatAdmin',['ui.router','ngResource','ngCookies']);

pa.service('API',function () {
    return {
        ROOT:'http://api.shouyinmao.cn'
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
        var sc = socketio.connect('http://api.shouyinmao.cn:8888');
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
    $urlRouterProvider.when("", "/login");

    $stateProvider
        .state('login', {url: "/login", templateUrl: "views/login.html"})
        .state('signup', {url: "/signup",templateUrl: "views/signup.html"})

        //服务员
        .state('waiter', {url: "/waiter",templateUrl: "views/waiter/nav.html"})
        .state('waiter.main', {url: "/main",templateUrl: "views/waiter/main.html"})
        .state('waiter.help', {url: "/help",templateUrl: "views/waiter/help.html"})

        //商户
        .state('customer', {url: "/customer",templateUrl: "views/customer/nav.html"})
        .state('customer.mantain_shop', {url: "/mantain/shop",templateUrl: "views/customer/shop.html"})
        .state('customer.mantain_assign_machine_shop', {url: "/mantain/shop_assign_machine",templateUrl: "views/customer/shop_assign_machine.html"})
        .state('customer.mantain_price', {url: "/mantain/price",templateUrl: "views/customer/price.html"})
        .state('customer.mantain_waiter', {url: "/mantain/waiter",templateUrl: "views/customer/waiter.html"})
        .state('customer.statistics_shop', {url: "/statistics/shop",templateUrl: "views/customer/shop_statistics.html"})
        .state('customer.statistics_shop.equip', {url: "/statistics/:shopId/equip",templateUrl: "views/customer/shop_equips_stats.html",params:{shopId:null}})
        .state('customer.statistics_equip', {url: "/statistics/equip",templateUrl: "views/customer/equip_statistics.html"})
        .state('customer.setting_cust_info', {url: "/setting/user_info",templateUrl: "views/customer/cust_info.html"})
        .state('customer.setting_cust_financial', {url: "/setting/user_financial",templateUrl: "views/customer/cust_financial.html"})

        //店铺管理员
        .state('shopper', {url: "/shopper",templateUrl: "views/shopper/nav.html"})
        .state('shopper.mantain_shop', {url: "/mantain/shop",templateUrl: "views/customer/shop.html"})
        .state('shopper.mantain_assign_machine_shop', {url: "/mantain/shop_assign_machine",templateUrl: "views/customer/shop_assign_machine.html"})
        .state('shopper.mantain_price', {url: "/mantain/price",templateUrl: "views/customer/price.html"})
        .state('shopper.mantain_waiter', {url: "/mantain/waiter",templateUrl: "views/customer/waiter.html"})
        .state('shopper.statistics_shop', {url: "/statistics/shop",templateUrl: "views/customer/shop_statistics.html"})
        .state('shopper.statistics_shop.equip', {url: "/statistics/:shopId/equip",templateUrl: "views/customer/shop_equips_stats.html",params:{shopId:null}})
        .state('shopper.statistics_equip', {url: "/statistics/equip",templateUrl: "views/customer/equip_statistics.html"})

        //管理员
        .state('admin', {url: "/admin",templateUrl: "views/admin/nav.html"})
        .state('admin.mantain_cust', {url: "/mantain_cust",templateUrl: "views/admin/mantain_cust.html"})
        .state('admin.mantain_cust.edit',
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
        .state('admin.appro_shop', {url: "/appro_shop",templateUrl: "views/admin/appro_shop.html"})
        .state('admin.mantain_equip', {url: "/mantain_equip",templateUrl: "views/admin/mantain_equip.html"})
        .state('admin.statistics_cust', {url: "/statistics_cust",templateUrl: "views/admin/cust_statistics.html"});
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
pa.controller('ApproViewController',ApproViewController);