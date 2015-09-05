angular.module('app').service('meemaWebService',
    ['$rootScope', '$http',
    function ($rootScope, $http) {
        this.getPage = function(params, callback) {
            $http({method: 'POST', url: 'http://www.meema.co/' + params.hardware_id + '/' + params.url,
                data: {password: params.password}})
                .success((function(data, status, headers, config) {
                    callback(null, true, data);
                }).bind(this))
                .error(function(data, status, headers, config) {
                    if (status == 400) {
                        callback(null, false);
                    } else {
                        callback(true);
                    }
                });
            //var fakedata = [{"label":"Username or email","selector":"#id_username.text.long-field","type":"text","input_value":"test"},{"label":"Password","selector":"#id_password.text.long-field","type":"password","input_value":"12345"}];
            //callback(null, false, fakedata);
        };

        this.putPage = function(params, callback) {
            $http({method: 'PUT', url: 'http://www.meema.co/' + params.hardware_id + '/' + params.url,
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
                data: {hardware_id: params.hardware_id, password: params.password}})
                .success((function(data, status, headers,config) {
                    callback(null);
                }).bind(this))
                .error(function(data, status, headers, config) {
                    callback(true);
                });
        };

        this.checkAccount = function(params, callback) {
            $http({method: 'POST', url: 'http://www.meema.co/account/check',
                data: {hardware_id: params.hardware_id}})
                .success((function(data, status, headers,config) {
                    callback(null, data);
                }).bind(this))
                .error(function(data, status, headers, config) {
                    callback(true);
                });
        };
    }
]);