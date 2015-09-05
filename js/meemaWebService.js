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
            var fakedata = {
                password: {
                    jqselector: '',
                    value: ''
                },
                other: [
                    {
                        jqselector: '',
                        value: ''
                    }
                ]
            };
            callback(null, false, fakedata);
        }
    }
]);