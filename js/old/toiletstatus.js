function readToilets(id) {
    console.log(id);
    if (id !== undefined) {
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                document.getElementById("toilet_status_" + id).src = xmlhttp.responseText;
            }
        }
        xmlhttp.open("GET", "http://136.225.5.101/toiletstate.php?id=" + id, true);
        xmlhttp.send();
    }
}