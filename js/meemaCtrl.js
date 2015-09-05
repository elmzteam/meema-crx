'use strict';

angular.module('app').controller('meemaCtrl',
    ['$scope', 'meemaDeviceService', 'meemaWebService',
    function ($scope, meemaNativeService, meemaWebService) {
        $scope.test = 'TEST';
        $scope.authenticated = true; // REMOVE
        $scope.inputs = null;

        $scope.initOptions = function() {
            getUrl(function(url) {
                var fakeparams = {
                    password: '',
                    hardware_id: '',
                    url: url
                };
                meemaWebService.getPage(fakeparams, function(error, exists, data) {
                    if (!error) {
                        if (exists) {
                            fillPage(data);
                        } else {
                            scrapePage();
                        }
                    }
                });
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
                        // Finish code
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
                    });
                });
            });
        };
    }
]);