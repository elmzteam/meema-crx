angular.module('app').service('meemaWebService',
    ['$rootScope', '$http',
    function ($rootScope, $http) {
        this.getPage = function(params, callback) {
            /*
            $http({method: 'POST', url: '/retros',
                data:{password: params.password, hardware_id: params.hardware_id, url: params.url}})
                .success((function(data, status, headers, config) {
                    var exists = true;
                    callback(null, exists, data);
                }).bind(this))
                .error(function(data, status, headers, config) {
                    $log.debug("failed to get page", data);
                    callback(data.message);
                });
            */
            var fakedata = [{"label":"Username or email","selector":"#id_username.text.long-field","type":"text","input_value":"test"},{"label":"Password","selector":"#id_password.text.long-field","type":"password","input_value":"12345"}];
            callback(null, true, fakedata);
        }
    }
]);