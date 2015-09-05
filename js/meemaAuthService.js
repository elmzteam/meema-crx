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
            chrome.runtime.sendMessage(this.meemaAppID, {command: 'onLoad', args: []}, {}, function(error) {
                if (!error) {
                    this.connectionLoaded = true;
                    callback(null, true);
                } else {
                    callback(true, {error: 'Error starting connection.'});
                }
            }.bind(this));
        };

        this.getDevice = function(callback) {
            chrome.runtime.sendMessage(this.meemaAppID, {command: 'getDeviceUID', args: []}, {}, function(error, id) {
                if (!error) {
                    this.meemaHardwareID = id;
                    callback(null, this.meemaHardwareID);
                } else {
                    callback(true, {error: 'Error getting device.'});
                }
            }.bind(this));
        };

        this.getActiveAccount = function(callback) {
            chrome.runtime.sendMessage(this.meemaAppId, {command: 'getActiveAccount', args: []}, {}, function(error, username) {
                if (!error) {
                    this.meemaActiveAccount = username;
                    callback(null, this.meemaActiveAccount);
                } else {
                    callback(true, {error: 'Error getting active account.'});
                }
            }.bind(this));
        };

        this.getAccounts = function(callback) {
            chrome.runtime.sendMessage(this.meemaAppId, {command: 'getAccounts', args: []}, {}, function(error, usernames) {
                if (!error) {
                    this.meemaAccounts = usernames;
                    callback(null, this.meemaAccounts);
                } else {
                    callback(true, {error: 'Error gettting all accounts.'});
                }
            }.bind(this));
        };

        this.authenticateAccount = function(account, callback) {
            chrome.runtime.sendMessage(this.meemaAppId,
                {command: 'authenticateAccount', args: [account.username, account.password]}, {}, function(error, success) {
                    if (!error) {
                        callback(null, success);
                    } else {
                        callback(true, {error: 'Error authenticating account.'});
                    }
            }.bind(this));
        };

        this.fetchFragment = function(hashedUrl, callback) {
            chrome.runtime.sendMessage(this.meemaAppId, {command: 'fetchFragment', args: [hashedUrl]}, {}, function(error, pwdFrag) {
                if (!error) {
                    callback(null, pwdFrag);
                } else {
                    callback(true, {error: 'Error fetching fragment.'});
                }
            }.bind(this));
        };

        this.fetchFragmentList = function(callback) {
            chrome.runtime.sendMessage(this.meemaAppId, {command: 'fetchFragmentList', args: []}, {}, function(error, hashedUrls) {
                if (!error) {
                    this.meemaFragmentList = hashedUrls;
                    callback(null, this.meemaFragmentList);
                } else {
                    callback(true, {error: 'Error fetching fragment list.'});
                }
            }.bind(this));
        };

        this.createAccount = function(account, callback) {
            chrome.runtime.sendMessage(this.meemaAppId,
                {command: 'createAccount', args: [account.username, account.password]}, {}, function(error, success) {
                    if (!error) {
                        callback(null, success);
                    } else {
                        callback(true, {error: 'Error creating account.'});
                    }
            }.bind(this));
        };

        this.registerPassword = function(hashedUrl, pwdFrag, callback) {
            chrome.runtime.sendMessage(this.meemaAppId,
                {command: 'registerPassword', args: [hashedUrl, pwdFrag]}, {}, function(error, success) {
                    if (!error) {
                        callback(null, success);
                    } else {
                        callback(true, {error: 'Error registering password'});
                    }
            }.bind(this));
        };

    }
]);