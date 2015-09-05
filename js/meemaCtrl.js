'use strict';

angular.module('app').controller('meemaCtrl',
    ['$scope', 'meemaDeviceService', 'meemaWebService',
    function ($scope, meemaNativeService, meemaWebService) {
        $scope.test = 'TEST';
        $scope.authenticated = true; // REMOVE

        $scope.initOptions = function() {
            var fakeparams = {
                password: '',
                hardware_id: '',
                url: ''
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
        };

        var fillPage = function(data) {

        };

        var scrapePage = function() {
            var query = { active: true, currentWindow: true };
            chrome.tabs.query(query, function(tabs) {
                // Send a request to the content script.
                chrome.tabs.sendRequest(tabs[0].id, {action: "scrape"}, function(response) {
                    console.log(response);
                });
            });
        };
    }
]);