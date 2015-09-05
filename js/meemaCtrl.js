'use strict';

angular.module('app').controller('meemaCtrl',
    ['$scope', 'meemaAuthService', 'meemaWebService',
    function ($scope, meemaAuthService, meemaWebService) {
        $scope.connected = false;
        $scope.hasDevice = false;
        $scope.accounts = [];
        $scope.authenticated = false;
        $scope.inputs = null;
        $scope.canSave = false;
        $scope.pageUrl = null;
        $scope.user = {};
        $scope.loginUser = '';
        $scope.loginPassword = '';
        $scope.newUserUsername = '';
        $scope.newUserPassword = '';
        $scope.attemptingLogin = false;
        $scope.attemptingNewUser = false;
        // TEST USER
        /* $scope.user = {
            hardware_id: 'abc',
            username: '123',
            password: 'pw'
        }; */

        $scope.initOptions = function() {
            getUrl(function(url) {
                console.log('got url', url);
                $scope.pageUrl = url;
                var params = {
                    username: $scope.user.username,
                    password: $scope.user.password,
                    hardware_id: meemaAuthService.meemaHardwareID,
                    url: hashCode($scope.pageUrl)
                };
                console.log('req params', params);
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
                    username: $scope.user.username,
                    password: $scope.user.password,
                    hardware_id: meemaAuthService.meemaHardwareID,
                    url: hashCode($scope.pageUrl),
                    store: $scope.inputs
                };
                meemaWebService.putPage(params, function(error) {
                    console.log(error ? 'Error!' : 'Success!');
                });
            }
        };

        $scope.showLogin = function(user) {
            console.log('showing login', user);
            $scope.loginUser = user;
            $scope.attemptingLogin = true;
        };

        $scope.cancelLogin = function() {
            console.log('canceling login');
            $scope.loginUser = '';
            $scope.attemptingLogin = false;
        };

        $scope.login = function() {
            console.log('logging in', $scope.loginUser, $scope.loginPassword);
            authenticate({
                username: $scope.loginUser,
                password: $scope.loginPassword
            });
        };

        $scope.showNewUser = function() {
            $scope.attemptingNewUser = true;
        };

        $scope.cancelNewUser = function() {
            $scope.attemptingNewUser = false;
        };

        $scope.newUser = function() {
            console.log('creating new user', $scope.newUserUsername, $scope.newUserPassword);
            if ($scope.accounts.indexOf($scope.newUserUsername) < 0) {
                var newUser = {
                    username: $scope.newUserUsername,
                    password: $scope.newUserPassword,
                    hardware_id: meemaAuthService.meemaHardwareID
                };
                meemaWebService.checkAccount(newUser, function(error, exists) {
                    if (!error && !exists) {
                        meemaWebService.newAccount(newUser, function(error) {
                            if (!error) {
                                console.log('Created web account!');
                            } else {
                                console.log('Error! Was not able to create web account');
                            }
                        });
                        meemaAuthService.createAccount(newUser, function(error, res) {
                            if (!error && res) {
                                console.log('Created Meema key account!');
                                authenticate(newUser);
                            } else {
                                console.log('Error!', res.error);
                            }
                        });
                    } else {
                        if (error) {
                            console.log('Error!');
                        } else {
                            console.log('Account exists already online!');
                        }
                    }
                });
            } else {
                console.log('This username already exists locally');
            }
        };

        $scope.checkAccount = function(id) {
            meemaWebService.checkAccount({hardware_id: id}, function(error, data) {
                console.log(data);
            });
        };

        var onConnectionLoaded = function(error, res) {
            if (!error) {
                console.log('started connection', meemaAuthService.connectionLoaded);
                $scope.$apply(function() {
                    $scope.connected = meemaAuthService.connectionLoaded;
                });
                meemaAuthService.getDevice(onGetDevice);
            } else {
                console.log('Error!', res.error);
            }
        };

        var onGetDevice = function(error, res) {
            if (!error) {
                console.log('got device id', res);
                $scope.hasDevice = true;
                authenticate();
            } else {
                console.log('Error!', res.error);
            }
        };

        var authenticate = function(account) {
            console.log('authenticating', account);
            if (account) {
                meemaAuthService.authenticateAccount(account, function(error, res) {
                   if (!error) {
                       if (res) {
                           console.log('authenticated!');
                           $scope.$apply(function() {
                               $scope.user = account;
                               $scope.authenticated = true;
                           });
                       } else {
                           console.log('not authenticated, getting list of accounts');
                           getAccounts();
                       }
                   } else {
                       console.log('Error!', res.error);
                       getAccounts();
                   }
                });
            } else {
                meemaAuthService.isUnlocked(function(error, res) {
                    if (!error) {
                        if (res) {
                            console.log('is unlocked');
                            meemaAuthService.getActiveAccount(function(error, res) {
                                if (!error) {
                                    console.log('got active account, authenticated', res);
                                    $scope.$apply(function() {
                                        $scope.user = meemaAuthService.meemaActiveAccount;
                                        $scope.authenticated = true;
                                    });
                                } else {
                                    console.log('Error!', res.error);
                                }
                            });
                        } else {
                            console.log('is not unlocked');
                            getAccounts();
                        }
                    } else {
                        console.log('Error!', res.error);
                        getAccounts();
                    }
                });
            }
        };

        var getAccounts = function() {
            console.log('getting accounts');
            meemaAuthService.getAccounts(function(error, res) {
                if (!error) {
                    console.log('got accounts', meemaAuthService.meemaAccounts);
                    $scope.$apply(function() {
                        $scope.accounts = meemaAuthService.meemaAccounts;
                    });
                } else {
                    console.log('Error!', res.error);
                }
            })
        };

        var createAccount = function(account) {
            meemaAuthService.createAccount(account, function(error, res) {
                if (!error) {
                    if (res) {
                        console.log('created account!');
                        authenticate(account);
                    }
                } else {
                    console.log('Error!', res.error);
                }
            })
        };

        var getUrl = function(callback) {
            console.log('getting url');
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

        var init = function() {
            console.log('initing');
            meemaAuthService.getMeemaApp(function(error, maID) {
                if (!error) {
                    console.log('geot meema app id', maID);
                    meemaAuthService.startConnection(onConnectionLoaded);
                }
            })
        };

        init();
    }
]);