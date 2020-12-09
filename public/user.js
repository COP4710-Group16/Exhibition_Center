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





function dateSearch()
{
    var startDate = new Date (document.getElementById("dateStartIn").value).getTime();
    var endDate = new Date(document.getElementById("dateEndIn").value).getTime();

    if(startDate > endDate)
    {
      alert("Please choose an end date after the start date");
    }
    else
    {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
          {
            dateSearchCallback(xmlHttp.response); // to dateSearchCallback
          }
          else if(xmlHttp.status == 500)
          {
            alert(`500 internal server error`);
          }
          else
          {
            alert(xmlHttp.status);
          }
      }
      xmlHttp.responseType = 'json';
      xmlHttp.open( "GET", "/api/getEventsByDate?startDate="+ startDate + "&endDate=" + endDate, true ); // false for synchronous request
      xmlHttp.send( null );
    }
}

function dateSearchCallback(jsonData)
{
  let tableID = document.getElementById("dateSearchEvents");

  for (var i = 1; i < tableId.rows.length; i++) {
    tableID.deleteRow(i);
  }

  data = jsonData;
  jsonData.forEach((event, i) => {

    insertDateRow(event.eventTitle, event.eventURL, event.eventStart, event.eventEnd, event.eventID); // to insertDateRow

  });
}

function insertDateRow(title, url, start, end, eventID)
{
  let table = document.getElementById("dateSearchEvents");
  let rowNode = document.createElement("tr");
  let titleNode = document.createElement("td");
  let urlNode = document.createElement("td");
  let startNode = document.createElement("td");
  let endNode = document.createElement("td");
  let joinNode = document.createElement("td");

  let joinButton = document.createElement("button");

  titleNode.innerHTML = title;
  urlNode.innerHTML = url;
  startNode.innerHTML = start;
  endNode.innerHTML = end;

  if(isParticipating(eventID)) // to isParticipating
  {
    joinButton.disabled = true;
    joinButton.value = "Participating";
  }
  else
  {
    joinButton.Value = "Participate";
    joinButton.onclick = addPart(joinButton, eventID); // to addPart(icipation)
  }

  joinNode.appendChild(joinButton);

  rowNode.appendChild(titleNode);
  rowNode.appendChild(urlNode);
  rowNode.appendChild(startNode);
  rowNode.appendChild(endNode);
  rowNode.appendChild(joinNode);

  table.appendChild(rowNode);
}

function isParticipating(eventID) // TODO
{
  let userID = getCookie("userid"); // TODO: however you get the userID

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      {
        if(xmlHttp.response === "")
        {
          return false;
        }
        return true;
      }
      else if(xmlHttp.status == 500)
      {
        alert(`500 internal server error`);
      }
      else
      {
        alert(xmlHttp.status);
      }
  }
  xmlHttp.responseType = 'text';
  xmlHttp.open( "POST", "/api/getParticipationByUserAndEvent?userID="+ userID + "&eventID=" + eventID, true ); // false for synchronous request
  xmlHttp.send( null );
}

function addPart(button, eventID) // TODO
{
  let userID = getCookie("userid");

  var jPay = JSON.stringify({userID : userID, eventID : eventID});

  var xmlHttp = new XMLHttpRequest();

  xmlHttp.open("POST", "/api/addParticipation", true);

  xmlHttp.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  xmlHttp.send(jPay);

  xmlHttp.onload = function(){
    if(xmlHttp.status == 500)
        {
            alert(`500 internal server error`);
        }
        else if(xmlHttp.status == 200)
        {
            button.value = "Participating";
            button.disabled = true;
        }
        else
        {
            alert(xmlHttp.status);
        }
  }
}

function getCookie(cname)
{
  var name = cname + "=";
  var dedcode = decodeURIComponent(document.cookie);
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
