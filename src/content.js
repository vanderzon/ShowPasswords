var settings = {enabled: true},
    focused = null;

function setup() {
    addEventListeners(document.querySelectorAll('input[type=password]'));
    document.addEventListener('DOMNodeInserted', function (event) {
        var node = event.target,
            inputs = [];
        if (node.nodeName == 'INPUT' && node.type == 'password')
            inputs = [node];
        else if ('querySelectorAll' in node)
            inputs = node.querySelectorAll('input[type=password]');
        addEventListeners(inputs);
    });
    document.addEventListener('submit', function () {
        if (focused)
            onBlur.call(focused);
    });
}

function setEnabled(enabled) {
    settings.enabled = enabled;
    if (focused)
        onFocus.call(focused);
}

function addEventListeners(inputs) {
    for (var i = 0, n = inputs.length; i < n; ++i) {
        var e = inputs[i];
        e.addEventListener('blur', onBlur);
        e.addEventListener('focus', onFocus);
        if (e.webkitMatchesSelector(':focus'))
            onFocus.call(e);
    }
}

function onFocus() {
    this.type = settings.enabled ? 'text' : 'password';
    focused = this;
}

function onBlur() {
    this.type = 'password';
    if (focused == this)
        focused = null;
}

setup();
chrome.extension.sendRequest({method: 'isEnabled'}, function (response) {
    setEnabled(response.enabled);
});
chrome.extension.onRequest.addListener(function (request) {
    if (request.method == 'setEnabled')
        setEnabled(request.enabled);
});
