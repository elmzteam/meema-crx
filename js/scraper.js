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

var getOnlyOuterHTML = function(jqobject) {
    return jqobject
        .clone()
        .children()
        .remove()
        .end()[0]
        .outerHTML;
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
        console.log('scraping');
        var forms = $("form");
        console.log('forms', forms);
        var allInputs = [];
        for (var i = 0; i < forms.length; i++) {
            //var text = $('<div>').append($(forms[i]).clone()).html();
            var text = getOnlyOuterHTML($(forms[i]));
            if (text.indexOf('login') >= 0 || text.indexOf('Login') >= 0) {
                var ins = $(forms[i]).find("input[type='text'], input[type='password'], input[type='email'], input[type='number'], input:not([type])");
                for (var k = 0; k < ins.length; k++) {
                    allInputs.push(ins[k]);
                }
                console.log('found form with login text strict', allInputs);
            }
        }

        if (allInputs.length == 0) {
            for (i = 0; i < forms.length; i++) {
                text = $('<div>').append($(forms[i]).clone()).html();
                if (text.indexOf('login') >= 0 || text.indexOf('Login') >= 0) {
                    var ins = $(forms[i]).find("input[type='text'], input[type='password'], input[type='email'], input[type='number'], input:not([type])");
                    for (var k = 0; k < ins.length; k++) {
                        allInputs.push(ins[k]);
                    }
                    console.log('found form with login text loose', allInputs);
                }
            }
        }

        if (allInputs.length == 0) {
            allInputs = $("form input[type='text'], form input[type='password'], form input[type='email'], form input[type='number'], input:not([type])");
            console.log('allinputs normal', allInputs);
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
        console.log('inputs', inputs);
        console.log('labels', labels);
        var response = [];
        for (i = 0; i < inputs.length; i++) {
            var selector = getSelector($(inputs[i]));
            var input_value = $(inputs[i]).val();
            var name;
            if (inputs[i].placeholder) {
                name = inputs[i].placeholder;
            } else if (getText($(labels[i])) != '') {
                name = getText($(labels[i]));
            } else if (selector.indexOf('Username') >=0 || selector.indexOf('username') >= 0) {
                name = "Username";
            } else if (selector.indexOf('Password') >=0 || selector.indexOf('password') >= 0) {
                name = "Password";
            } else if (getText($(inputs[i]).parent().prev()).indexOf('mail') >= 0 || getText($(inputs[i]).parent().prev()).indexOf('user') >= 0 || getText($(inputs[i]).parent().prev()).indexOf('User') >= 0) {
                name = getText($(inputs[i]).parent().prev());
            } else {
                name = "Input #" + i;
            }

            // Label Overrides
            if (inputs[i].type == 'password') {
                name = "Password";
            }
            if (inputs[i].type == 'email') {
                name = "Email";
            }

            response.push({
                label: name,
                selector: selector,
                type: inputs[i].type,
                input_value: input_value,
                save: input_value != ""
            });
        }
        console.log(response);
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