angular.module('app').service('meemaWebService',
    ['$rootScope', '$http',
    function ($rootScope, $http) {
        this.getPage = function(params, callback) {
            console.log('webservice getting page');
            $http({method: 'POST', url: 'http://www.meema.co/' + params.hardware_id + '/' + params.username + '/' + params.url,
                data: {password: params.password}})
                .success((function(data, status, headers, config) {
                    console.log('get page success', data);
                    callback(null, true, data);
                }).bind(this))
                .error(function(data, status, headers, config) {
                    if (status == 400) {
                        console.log('400 get page');
                        callback(null, false);
                    } else {
                        callback(true);
                    }
                });
        };

        this.putPage = function(params, callback) {
            $http({method: 'PUT', url: 'http://www.meema.co/' + params.hardware_id + '/' + params.username + '/' + params.url,
                data: {password: params.password, store: params.store}})
                .success((function(data, status, headers, config) {
                    callback(null);
                }).bind(this))
                .error(function(data, status, headers, config) {
                    callback(true);
                });
        };

        this.newAccount = function(params, callback) {
            $http({method: 'POST', url: 'http://www.meema.co/account/new',
                data: {hardware_id: params.hardware_id, username: params.username, password: params.password}})
                .success((function(data, status, headers,config) {
                    callback(null);
                }).bind(this))
                .error(function(data, status, headers, config) {
                    callback(true);
                });
        };

        this.checkAccount = function(params, callback) {
            $http({method: 'POST', url: 'http://www.meema.co/account/check',
                data: {hardware_id: params.hardware_id, username: params.username}})
                .success((function(data, status, headers,config) {
                    callback(null, data);
                }).bind(this))
                .error(function(data, status, headers, config) {
                    callback(true);
                });
        };
    }
]);