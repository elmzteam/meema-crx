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
        var forms = $("form");
        var allInputs = null;
        for (var i = 0; i < forms.length; i++) {
            var text = $('<div>').append($(forms[i]).clone()).html();
            if (text.indexOf('login') >= 0 || text.indexOf('Login') >= 0) {
                allInputs = $(forms[i]).find("input[type='text'], input[type='password'], input[type='email'], input[type='number']");
                break;
            }
        }
        if (!allInputs) {
            allInputs = $("form input[type='text'], form input[type='password'], form input[type='email'], form input[type='number']");
        }
        var inputs = [];
        var labels = [];
        for (i = 0; i < allInputs.length; i++) {
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
        var response = [];
        for (i = 0; i < inputs.length; i++) {
            var selector = getSelector($(inputs[i]));
            var name = getText($(labels[i]));
            var input_value = $(inputs[i]).val();
            if (name == "") {
                if (inputs[i].placeholder) {
                    name = inputs[i].placeholder;
                } else if (selector.indexOf('Username') >=0 || selector.indexOf('username') >= 0) {
                    name = "Username";
                } else if (selector.indexOf('Password') >=0 || selector.indexOf('password') >= 0) {
                    name = "Password";
                } else {
                    name = "Input #" + i;
                }
            }
            response.push({
                label: name,
                selector: selector,
                type: inputs[i].type,
                input_value: input_value,
                save: input_value != ""
            });
        }
        //console.log(JSON.stringify(response));
        sendResponse({data: response});
    } else if (request.action == "fill") {
        for (var j = 0; j < request.data.length; j++) {
            if (request.data[j].save) {
                $(request.data[j].selector).val(request.data[j].input_value);
                $(request.data[j].selector).css("background-color", "rgba(10, 10, 200, 0.2)");
            } else {
                $(request.data[j].selector).val('');
                $(request.data[j].selector).css("background-color", "");
            }
        }
        sendResponse({finished: true});
    } else {
        sendResponse({error: 'Not a recognized action.'}); // Send nothing..
    }
});