
var pingButton = document.getElementById('ping-button');

function disablePingButton() {
    pingButton.classList.add('disabled')
};

function enablePingButton() {
    pingButton.classList.remove('disabled');
};

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

window.onload = () => {
    document.getElementById('ping-button').addEventListener('click', pingButtonClicked);
}

function pingButtonClicked() {
    console.log('clicked');
    disablePingButton();
    var regionList = Array.prototype.slice.call(document.getElementsByClassName('region'));
    doNextBox(regionList);
}

function doNextBox(regionList) {
    const box = regionList.shift();
    if (box) {
        var region = box.dataset.code;
        var endpoint = box.dataset.endpoint + `/?cache=${currentTimeMillis()}`;
        step1_connect(box, region, endpoint, regionList);
    } else {
        enablePingButton();
    }
}

var imageCell = $("#imageCell")
function ping_endpoint(endpoint, onComplete) {
    imageCell.empty();
    imageCell.html("<img id='pingImage' style='display: none'>");
    var pingImage = $("#pingImage");
    pingImage.error(onComplete);
    pingImage.attr("src", endpoint);
}

function step1_connect(box, region, endpoint, regionList) {
    box.children[2].innerText = 'connecting...';
    ping_endpoint(endpoint, function() { step2_ping(box, region, endpoint, regionList); });
}

function currentTimeMillis() {
    return (new Date()).getTime();
}

function step2_ping(box, region, endpoint, regionList) {
    box.children[2].innerText = 'pinging...';
    var startTime = currentTimeMillis();
    ping_endpoint(endpoint, function() { step3_finish(startTime, box, region, endpoint, regionList); });
}

function step3_finish(startTime, box, region, endpoint, regionList) {
    var endTime = currentTimeMillis();
    var elapsed = endTime - startTime;
    var resultText = elapsed.toString() + " ms";
    box.children[2].innerText = resultText;
    doNextBox(regionList);
}