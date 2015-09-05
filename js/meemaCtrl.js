'use strict';

angular.module('app').controller('meemaCtrl',
    ['$scope', 'meemaDeviceService', 'meemaWebService',
    function ($scope, meemaNativeService, meemaWebService) {
        $scope.authenticated = false;
        $scope.inputs = null;
        $scope.canSave = false;
        $scope.pageUrl = null;
        // TEST USER
        $scope.user = {
            hardware_id: 'abc',
            password: 'pw'
        };

        $scope.authenticate = function() {

        };

        $scope.initOptions = function() {
            getUrl(function(url) {
                $scope.pageUrl = url;
                var params = {
                    password: $scope.user.password,
                    hardware_id: $scope.user.hardware_id,
                    url: hashCode($scope.pageUrl)
                };
                meemaWebService.getPage(params, function(error, exists, data) {
                    if (!error) {
                        if (exists) {
                            $scope.inputs = data;
                            fillPage($scope.inputs);
                        } else {
                            scrapePage();
                        }
                    }
                });
            });
        };

        $scope.save = function() {
            if ($scope.canSave) {
                fillPage($scope.inputs);
                var params = {
                    password: $scope.user.password,
                    hardware_id: $scope.user.hardware_id,
                    url: hashCode($scope.pageUrl),
                    store: $scope.inputs
                };
                meemaWebService.putPage(params, function(error) {
                    console.log(error ? 'Error!' : 'Success!');
                });
            }
        };

        $scope.checkAccount = function(id) {
            meemaWebService.checkAccount({hardware_id: id}, function(error, data) {
                console.log(data);
            });
        };

        var getUrl = function(callback) {
            var query = { active: true, currentWindow: true };
            chrome.tabs.query(query, function(tabs) {
               callback(tabs[0].url);
            });
        };

        var fillPage = function(data) {
            var query = { active: true, currentWindow: true };
            chrome.tabs.query(query, function(tabs) {
                // Send a request to the content script.
                chrome.tabs.sendRequest(tabs[0].id, {action: "fill", data: data}, function(response) {
                    $scope.$apply(function() {
                        $scope.canSave = true;
                    });
                });
            });
        };

        var scrapePage = function() {
            var query = { active: true, currentWindow: true };
            chrome.tabs.query(query, function(tabs) {
                // Send a request to the content script.
                chrome.tabs.sendRequest(tabs[0].id, {action: "scrape"}, function(response) {
                    $scope.$apply(function() {
                        $scope.inputs = response.data;
                        $scope.canSave = true;
                    });
                });
            });
        };

        var hashCode = function(str) {
            var hash = 0, i, chr, len;
            if (str.length == 0) return hash;
            for (i = 0, len = str.length; i < len; i++) {
                chr   = str.charCodeAt(i);
                hash  = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        };

        $scope.authenticate();
    }
]);