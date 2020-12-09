function submitForm() {
    if (document.getElementById("eventTitle").value == "") {
        alert("Event Title is a required field.");
        return false;
    }
    if (document.getElementById("eventURL").value == "") {
        alert("Event URL is a required field.");
        return false;
    }
    if (document.getElementById("eventCity").value == "") {
        alert("Event City is a required field.");
        return false;
    }
    if (document.getElementById("eventStart").value == "") {
        alert("Start Date is a required field.");
        return false;
    }
    if (document.getElementById("eventEnd").value == "") {
        alert("End Date is a required field.");
        return false;
    }
    if (document.getElementById("eventDesc").value == "") {
        alert("Event Description is a required field.");
        return false;
    }

    var title = document.getElementById("eventTitle").value;
    var description = document.getElementById("eventDesc").value;
    var city =  document.getElementById("eventCity").value;
    var url = document.getElementById("eventURL").value;
    var startDate = new Date(document.getElementById("eventStart").value)
    var endDate = new Date(document.getElementById("eventEnd").value)

    if (startDate.getTime() > endDate.getTime()) {
        alert("Event cannot end before it begins.");
        return false;
    }

    createEvent(title, url, city, document.getElementById("eventStart").value, document.getElementById("eventEnd").value, description);
    alert("Event Created.");
    location.reload();
    return false;
}

function checkChanged()
{
    var body = document.getElementById("tableBody");


    if(document.getElementById("activeEventsOnly").checked)
    {
        hideRows();
    }
    else
    {
        for (var i = 0; i < body.rows.length; i++)
        {
            var row = body.rows[i];
            row.hidden = false;
        }
    }
}

function hideRows()
{
    var body = document.getElementById("tableBody");

    for (var i = 0; i < body.rows.length; i++)
    {
        var row = body.rows[i];
        var start = new Date( row.cells[2].innerHTML );
        var end = new Date( row.cells[2].innerHTML );
        var now = new Date();

        row.hidden = (start > now || end < now);
    }
}

function getFormattedDate(date) {
    var year = date.getFullYear();
  
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
  
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    
    return month + '/' + day + '/' + year;
  }

function createEvent(etitle, eurl, ecity, ebegin, eends, edescription)
{
    var userID = getCookie("userid");
    if(userID == '')
    {
        userID = 1;
    }

    var jsonPayload = JSON.stringify({title : etitle, url : eurl, description : edescription, city : ecity, begins : ebegin, ends : eends, adminID : userID});

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/createEvent", true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.send(jsonPayload);
}

function addEvents() 
{
    var xmlHttp = new XMLHttpRequest();
    var cookie = getCookie("userid");
    var ids = [];

    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            xmlHttp.response.forEach((e)=>
            {
                if(!ids.includes(e.eventID))
                {
                    insertResultRow(e.eventTitle, e.eventURL, e.eventStartDate, e.eventEndDate, e.city);
                }

                ids.push(e.eventID);
            });
        }
    }

    var jsonPayload = JSON.stringify({userID : cookie});

    xmlHttp.responseType = 'json';
    xmlHttp.open("POST", "/api/getEventsByParticipation", true); // false for synchronous request
    xmlHttp.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xmlHttp.send(jsonPayload);
} 

function insertResultRow(title, url, start, end, city) {

    var table = document.getElementById('tableBody');
    var row = table.insertRow();

    var titleCell = row.insertCell(0);
    var urlCell = row.insertCell(1);
    var startCell = row.insertCell(2);
    var endCell = row.insertCell(3);
    var cityCell = row.insertCell(4);

    titleCell.innerHTML = title;
    urlCell.innerHTML = url;
    startCell.innerHTML = getFormattedDate(new Date(start));
    endCell.innerHTML = getFormattedDate(new Date(end));
    cityCell.innerHTML = city;
}

function getCookie(cname)
{
  var name = cname + "=";
  var decode = decodeURIComponent(document.cookie);
  var ca = decode.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}