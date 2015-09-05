chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    console.log('listener');
    if (request.action == "scrape") {
        console.log('scraping');
        var inputs = ['test1', 'test2'];
        sendResponse({inputs: inputs});
    } else if (request.action == "fill") {
        sendResponse({finished: true});
    } else {
        sendResponse({error: 'Not a recognized action.'}); // Send nothing..
    }
});

(function() {
    console.log("loaded!");
})();