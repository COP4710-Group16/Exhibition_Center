function adminSearch() {
    var name = document.getElementById("adminSearchName").value;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            adminSearchCallback(xmlHttp.response);
    }
    xmlHttp.responseType = 'json';
    xmlHttp.open("GET", "/api/getEventsByAdmin?adminName=" + name, true); // false for synchronous request
    xmlHttp.send(null);
}

function adminSearchCallback(jsonData) {
    var table = document.getElementById("adminSearchEvents");

    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }

    jsonData.forEach((event, index) => {
        insertAdminRow(event.username, event.eventTitle, event.eventURL, event.eventStartDate, event.eventEndDate, event.city);
    });
}

function insertAdminRow(username, title, url, start, end, city) {
    var table = document.getElementById("adminSearchEvents");
    var row = table.insertRow();

    var userCell = row.insertCell(0);
    var titleCell = row.insertCell(1);
    var urlCell = row.insertCell(2);
    var startCell = row.insertCell(3);
    var endCell = row.insertCell(4);
    var cityCell = row.insertCell(5);

    userCell.innerHTML = username;
    titleCell.innerHTML = title;
    urlCell.innerHTML = url;
    startCell.innerHTML = start;
    endCell.innerHTML = end;
    cityCell.innerHTML = city;
}

function userSearch() {
    var name = document.getElementById("userName").value;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            userSearchCallback(xmlHttp.response);
    }
    xmlHttp.responseType = 'json';
    xmlHttp.open("GET", "/api/getEventsByUser?userName=" + name, true); // false for synchronous request
    xmlHttp.send(null);
}

function userSearchCallback(jsonData) {
    var table = document.getElementById("userSearchEvents");

    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }

    jsonData.forEach((event, index) => {
        insertUserRow(event.username, event.eventTitle);
    });
}

function insertUserRow(username, title) {
    var table = document.getElementById("userSearchEvents");
    var row = table.insertRow();

    var usernameCell = row.insertCell(0);
    var titleCell = row.insertCell(1);
    usernameCell.innerHTML = username;
    titleCell.innerHTML = title;
}
