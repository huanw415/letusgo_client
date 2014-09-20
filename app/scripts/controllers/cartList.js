'use strict';

angular.module('letusgoApp')
    .controller('CartListCtrl', function ($scope, BoughtGoodsService) {

        $scope.$emit('to-parent-changeClickCount', 1, 0);
        function downloadWeb(){

            $scope.cartGoods = BoughtGoodsService.generateCartGoods();
            $scope.totalMoney = BoughtGoodsService.getTotalMoney();

            BoughtGoodsService.getClickCount(function(data){
                $scope.totalNumber = data;
                console.log(data);
            });
        }

        $scope.$emit('to-parent-navigator-incart');

        downloadWeb();

        $scope.modifyCartItemNum = function (cartItem, direction) {

            BoughtGoodsService.modifyCartItemNum(cartItem, direction);

            $scope.$emit('to-parent-changeClickCount', direction, 1);

            downloadWeb();
        };

        $scope.deleteItem = function (cartItem) {

            BoughtGoodsService.deleteItem(cartItem);

            $scope.$emit('to-parent-changeClickCount', 0, cartItem.num);

            downloadWeb();
        };


    });
