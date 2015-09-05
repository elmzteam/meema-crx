var getSelector = function(jqobject) {
    var selector = jqobject
        .parents()
        .map(function() { return jqobject.tagName; })
        .get()
        .reverse()
        .concat([jqobject.nodeName])
        .join(">");

    var id = jqobject.attr("id");
    if (id) {
        selector += "#"+ id;
    }

    var classNames = jqobject.attr("class");
    if (classNames) {
        selector += "." + $.trim(classNames).replace(/\s/gi, ".");
    }
    return selector;
};

var getText = function(jqobject) {
    return jqobject
        .clone()
        .children()
        .remove()
        .end()
        .text()
        .trim();
};

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.action == "scrape") {
        var allInputs = $("form input").not("[type='hidden']");
        var inputs = [];
        var labels = [];
        for (var i = 0; i < allInputs.length; i++) {
            if ($(allInputs[i]).is(":visible")) {
                inputs.push(allInputs[i]);
                var label = $('label[for="' + $(allInputs[i]).attr('id') + '"]');
                if (label.length <= 0) {
                    var parentElem = $(allInputs[i]).parent(),
                        parentTagName = parentElem.get(0).tagName.toLowerCase();
                    if(parentTagName == "label") {
                        label = parentElem;
                    }
                    labels.push(label);
                } else {
                    labels.push(label[0]);
                }
            }
        }
        console.log(inputs, labels);
        var response = [];
        for (i = 0; i < inputs.length; i++) {
            response.push({
                label: getText($(labels[i])),
                selector: getSelector($(inputs[i])),
                type: inputs[i].type
            });
        }
        console.log(response);
        sendResponse({res: response});
    } else if (request.action == "fill") {
        sendResponse({finished: true});
    } else {
        sendResponse({error: 'Not a recognized action.'}); // Send nothing..
    }
});