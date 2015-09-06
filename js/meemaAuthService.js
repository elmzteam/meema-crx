angular.module('app').service('meemaAuthService',
    ['$rootScope',
    function ($rootScope) {

        this.meemaAppID = '';
        this.meemaHardwareID = '';
        this.meemaActiveAccount = '';
        this.meemaAccounts = [];
        this.meemaFragmentList = [];
        this.connectionLoaded = false;

        this.getMeemaApp = function(callback) {
            this.meemaAppID = 'kalpjdjbfcoflmnbachnpffacpkdoeee';
            callback(null, this.meemaAppID);
        };

        this.startConnection = function(callback) {
            console.log('authservice start connection');
            chrome.runtime.sendMessage(this.meemaAppID, {command: 'connect', args: []}, {}, function(res) {
                console.log(arguments);
                if (!res.error && res.result) {
                    this.connectionLoaded = true;
                    callback(null, true);
                } else {
                    callback(true, {error: 'Error starting connection.'});
                }
            }.bind(this));
        };

        this.getDevice = function(callback) {
            console.log('authservice get device');
            chrome.runtime.sendMessage(this.meemaAppID, {command: 'getDeviceUID', args: []}, {}, function(res) {
                console.log('in get device callback', res);
                if (!res.error) {
                    this.meemaHardwareID = res.result;
                    callback(null, this.meemaHardwareID);
                } else {
                    callback(true, {error: 'Error getting device.'});
                }
            }.bind(this));
        };

        this.isUnlocked = function(callback) {
            console.log('authservice running is unlocked');
            chrome.runtime.sendMessage(this.meemaAppID, {command: 'isUnlocked', args: []}, {}, function(res) {
                if (!res.error) {
                    callback(null, res.result);
                } else {
                    callback(true, {error: 'Error check if device is unlocked.'});
                }
            }.bind(this));
        };

        this.getActiveAccount = function(callback) {
            console.log('authservice getting active account');
            chrome.runtime.sendMessage(this.meemaAppID, {command: 'getActiveAccount', args: []}, {}, function(res) {
                console.log('callback of get active account', res);
                if (!res.error) {
                    this.meemaActiveAccount = res.result;
                    callback(null, this.meemaActiveAccount);
                } else {
                    callback(true, {error: 'Error getting active account.'});
                }
            }.bind(this));
        };

        this.getAccounts = function(callback) {
            console.log('authservice getting accounts');
            chrome.runtime.sendMessage(this.meemaAppID, {command: 'getAccounts', args: []}, {}, function(res) {
                if (!res.error) {
                    this.meemaAccounts = res.result;
                    callback(null, this.meemaAccounts);
                } else {
                    callback(true, {error: 'Error getting all accounts.'});
                }
            }.bind(this));
        };

        this.authenticateAccount = function(account, callback) {
            console.log('authservice authenticating account');
            chrome.runtime.sendMessage(this.meemaAppID,
                {command: 'authenticateAccount', args: [account.username, account.password]}, {}, function(res) {
                    console.log('callback of authservice authentication', res);
                    if (!res.error) {
                        callback(null, res.result);
                    } else {
                        callback(true, {error: 'Error authenticating account.'});
                    }
            }.bind(this));
        };

        this.fetchFragment = function(hashedUrl, callback) {
            console.log('authservice fetching fragment');
            chrome.runtime.sendMessage(this.meemaAppID, {command: 'fetchFragment', args: [hashedUrl]}, {}, function(res) {
                console.log('callback fetched fragment', res);
                if (!res.error) {
                    callback(null, res.result);
                } else {
                    callback(true, {error: 'Error fetching fragment.'});
                }
            }.bind(this));
        };

        this.fetchFragmentList = function(callback) {
            chrome.runtime.sendMessage(this.meemaAppID, {command: 'fetchFragmentList', args: []}, {}, function(res) {
                if (!res.error) {
                    this.meemaFragmentList = res.result;
                    callback(null, this.meemaFragmentList);
                } else {
                    callback(true, {error: 'Error fetching fragment list.'});
                }
            }.bind(this));
        };

        this.createAccount = function(account, callback) {
            chrome.runtime.sendMessage(this.meemaAppID,
                {command: 'createAccount', args: [account.username, account.password]}, {}, function(res) {
                    if (!res.error) {
                        callback(null, res.result);
                    } else {
                        callback(true, {error: 'Error creating account.'});
                    }
            }.bind(this));
        };

        this.registerPassword = function(hashedUrl, pwdFrag, callback) {
            console.log('authservice registering password', hashedUrl, pwdFrag);
            chrome.runtime.sendMessage(this.meemaAppID,
                {command: 'registerPassword', args: [hashedUrl, pwdFrag]}, {}, function(res) {
                    console.log('register password callback', res);
                    if (!res.error) {
                        callback(null, res.result);
                    } else {
                        callback(true, {error: 'Error registering password'});
                    }
            }.bind(this));
        };

    }
]);