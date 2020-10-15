
var pingButton = $("#pingbutton");

function disablePingButton() {
    pingButton.attr("disabled", "disabled");
};

function enablePingButton() {
    pingButton.removeAttr("disabled");
};

// http://stackoverflow.com/questions/1403888/get-url-parameter-with-jquery
function getURLParameter(name) {
    var regex = new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)');
    var matches = regex.exec(location.search);
    if (matches == null) {
        return null;
    }
    var value = matches[1];
    var value = value.replace(/\+/g, '%20');
    return decodeURIComponent(value);
}

$(document).ready(function() {
    $("#pingbutton").click(pingButtonClicked);
    if (getURLParameter("run")) {
        $("#pingbutton").click();
    }
});

function pingButtonClicked() {
    disablePingButton();
    var latencyBoxes = $(".latency").toArray();
    latencyBoxes.reverse();
      doNextBox(latencyBoxes);
}

function doNextBox(latencyBoxes) {
    var box = latencyBoxes.pop();
    if (box) {
        var region = box.id;
        var endpoint = box.getAttribute("endpoint");
        step1_connect(box, region, endpoint, latencyBoxes);
    } else {
        enablePingButton();
    }
}

var imageCell = $("#imageCell")
function ping_endpoint(endpoint, onComplete) {
    var randomString = Math.floor(Math.random()*0xFFFFFFFFFFFFFFFF).toString(36);
    var targetUrl = endpoint + "ping?x=" + randomString;
    imageCell.empty();
    imageCell.html("<img id='pingImage' style='display: none'>");
    var pingImage = $("#pingImage");
    pingImage.error(onComplete);
    pingImage.attr("src", targetUrl);
}

function step1_connect(box, region, endpoint, latencyBoxes) {
    $(box).html("connecting");
    ping_endpoint(endpoint, function() { step2_ping(box, region, endpoint, latencyBoxes); });
}

function currentTimeMillis() {
    return (new Date()).getTime();
}

function step2_ping(box, region, endpoint, latencyBoxes) {
    $(box).html("pinging");
    var startTime = currentTimeMillis();
    ping_endpoint(endpoint, function() { step3_finish(startTime, box, region, endpoint, latencyBoxes); });
}

function step3_finish(startTime, box, region, endpoint, latencyBoxes) {
    var endTime = currentTimeMillis();
    var elapsed = endTime - startTime;
    var resultText = elapsed.toString() + " ms";
    $(box).html(resultText);
    doNextBox(latencyBoxes);
}