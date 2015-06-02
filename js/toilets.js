function start() {
    window.blurred = false;
    interval = setInterval(load, 1000);
}

function load() {
    if (window.blurred) {
        return;
    }
    readToilets(1);
    readToilets(2);
}

window.onfocus = function () {
    window.blurred = false;
};

window.onblur = function () {
    window.blurred = true;
};

function readToilets(id) {
    var xmlhttp = new XMLHttpRequest();
    if (id !== undefined) {
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200 && xmlhttp.responseText.length > 0) {
                document.getElementById("toilet_status_" + id).src = xmlhttp.responseText;
            }
        };
        xmlhttp.open("GET", "toiletstate.php?v=1&id=" + id, true);
        xmlhttp.send();
    }
}
$('a[data-toggle="tab"]:first').on('show.bs.tab', function (e) {
    function dbLoaded() {
        getDataWithID(1, 0);
        getDataWithID(2, 0);
    }
    setTimeout(dbLoaded, 1000);
});
$('a[data-toggle="tab"]:eq(1)').on('show.bs.tab', function (e) {
    function dbLoaded() {
        getAmount(1, 0);
        getAmount(2, 0);
    }
    setTimeout(dbLoaded, 1000);
});
$('a[data-toggle="tab"]:eq(2)').on('show.bs.tab', function (e) {
    function dbLoaded() {
        getAvailability(0);
    }
    setTimeout(dbLoaded, 1000);
});
$('#collapseStatistics').on('show.bs.collapse', function () {
    $('a[data-toggle="tab"]:first').tab('show');
});
