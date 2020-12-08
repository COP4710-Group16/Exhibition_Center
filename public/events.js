function submitForm() {
    if (document.forms["newEventForm"]["eventTitle"].value == "") {
        alert("Event Title is a required field.");
        return false;
    }
    if (document.forms["newEventForm"]["eventURL"].value == "") {
        alert("Event URL is a required field.");
        return false;
    }
    if (document.forms["newEventForm"]["eventCity"].value == "") {
        alert("Event City is a required field.");
        return false;
    }
    if (document.forms["newEventForm"]["eventStart"].value == "") {
        alert("Start Date is a required field.");
        return false;
    }
    if (document.forms["newEventForm"]["eventEnd"].value == "") {
        alert("End Date is a required field.");
        return false;
    }
    if (document.forms["newEventForm"]["eventDesc"].value == "") {
        alert("Event Description is a required field.");
        return false;
    }

    var startDate = new Date(document.forms["newEventForm"]["eventStart"].value).getTime()
    var endDate = new Date(document.forms["newEventForm"]["eventEnd"].value).getTime()

    if (startDate > endDate) {
        alert("Event cannot end before it begins.");
        return false;
    }

    return true;
}

function addEvents() {

    var table = document.getElementById('resultsEvents');
    var row = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');
    td1.innerHTML = document.getElementById('eventTitle').value;
    td2.innerHTML = document.getElementById('eventURL').value;
    td3.innerHTML = document.getElementById('eventCity').value;
    td4.innerHTML = document.getElementById('eventStart').value;
    td5.innerHTML = document.getElementById('eventEnd').value;
    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
    row.appendChild(td5);
    table.children[0].appendChild(row);

} 