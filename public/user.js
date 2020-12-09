function locationSearch() {
    var name = document.getElementById("searchbyLocationInput").value;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            locationSearchCallBack(xmlHttp.response);
    }
    xmlHttp.responseType = 'json';
    xmlHttp.open("GET", "/api/getEventsByLocation?locationName=" + name, true); // false for synchronous request
    xmlHttp.send(null);
}

function locationSearchCallBack(jsonData) {
    var table = document.getElementById("locationSearchEvents");

    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }

    data = jsonData;
    jsonData.forEach((event, index) => {
        insertLocationRow(event.eventTitle, event.eventURL, event.city);
    });
}

function insertLocationRow(title, url, city) {
    var table = document.getElementById("locationSearchEvents");
    var row = table.insertRow();
    var titleCell = row.insertCell(0);
    var urlCell = row.insertCell(1);
    var cityCell = row.insertCell(2);

    titleCell.innerHTML = title;
    urlCell.innerHTML = url;
    cityCell.innerHTML = city;
}