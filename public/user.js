function locationSearch() {
    var name = document.getElementById("searchbyLocationInput").value;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            locationSearchCallBack(xmlHttp.response);
    }
    xmlHttp.responseType = 'json';
    xmlHttp.open("GET", "/api/getEventsByLocation?city=" + name, true); // false for synchronous request
    xmlHttp.send(null);
}

function locationSearchCallBack(jsonData) {
    var table = document.getElementById("locationSearchEvents");

    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }

    data = jsonData;
    jsonData.forEach((event, index) => {
        insertLocationRow(event.eventTitle, event.eventURL, event.eventStartDate, event.eventEndDate, event.city, event.eventID);
    });
}

function insertLocationRow(title, url, start, end, city, eventID)
{
    let table = document.getElementById("locationSearchEvents");
    let rowNode = document.createElement("tr");
    let titleNode = document.createElement("td");
    let urlNode = document.createElement("td");
    let startNode = document.createElement("td");
    let endNode = document.createElement("td");
    let cityNode = document.createElement("td");
    let joinNode = document.createElement("td");
  
    titleNode.innerHTML = title;
    urlNode.innerHTML = url;
    startNode.innerHTML = start;
    endNode.innerHTML = end;
    cityNode.innerHTML = city;
  
    checkParticipating(joinNode, eventID);
  
    rowNode.appendChild(titleNode);
    rowNode.appendChild(urlNode);
    rowNode.appendChild(startNode);
    rowNode.appendChild(endNode);
    rowNode.appendChild(cityNode);
    rowNode.appendChild(joinNode);
  
    table.appendChild(rowNode);
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
      xmlHttp.onreadystatechange = function() 
      {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
          dateSearchCallback(xmlHttp.response); // to dateSearchCallback
      }

      startDate = document.getElementById("dateStartIn").value;
      endDate =  document.getElementById("dateEndIn").value;

      xmlHttp.responseType = 'json';
      xmlHttp.open( "GET", "/api/getEventsByDate?startDate="+ startDate + "&endDate=" + endDate, true ); // false for synchronous request
      xmlHttp.send( null );
    }
}

function dateSearchCallback(jsonData)
{
  var tableID = document.getElementById("dateSearchEvents");

  for (var i = 1; i < tableID.rows.length; i++) {
    tableID.deleteRow(i);
  }
  
  jsonData.forEach((event, i) => {

    insertDateRow(event.eventTitle, event.eventURL, event.eventStartDate, event.eventEndDate, event.eventID); // to insertDateRow

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

  titleNode.innerHTML = title;
  urlNode.innerHTML = url;
  startNode.innerHTML = start;
  endNode.innerHTML = end;

  checkParticipating(joinNode, eventID);

  rowNode.appendChild(titleNode);
  rowNode.appendChild(urlNode);
  rowNode.appendChild(startNode);
  rowNode.appendChild(endNode);
  rowNode.appendChild(joinNode);

  table.appendChild(rowNode);
}

var participating = false;

function checkParticipating(joinNode, EventID) // TODO
{
  let UserID = getCookie("userid"); 
  var xhr = new XMLHttpRequest();
   participating = false;

  xhr.onreadystatechange = function() {

      if (xhr.readyState == 4 && xhr.status == 200)
      {
        if(xhr.response.response)
        {
          joinNode.innerHTML = `<input type="button" name="participate" value="Participate" disabled>`;
        }
        else
        {
          joinNode.innerHTML = `<input type="button" name="participate" value="Participate" onclick="particpateClicked(` + EventID + `, this)">`;
        }
      }
      else if(xhr.status == 500)
      {
        alert(`500 internal server error`);
      }
  }

  var jsonPayload = JSON.stringify({userID : UserID, eventID : EventID});

  xhr.responseType = 'json';
  xhr.open("POST", "/api/getParticipationByUserAndEvent", true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  xhr.send(jsonPayload);
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

function particpateClicked(EventID, btn)
{
  let UserID = getCookie("userid"); 
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {

      if (xhr.readyState == 4 && xhr.status == 200)
      {
        btn.disabled = true;
      }
      else if(xhr.status == 500)
      {
        alert(`500 internal server error`);
      }
  }

  var jsonPayload = JSON.stringify({userID : UserID, eventID : EventID});

  xhr.responseType = 'json';
  xhr.open("POST", "/api/addParticipation", true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  xhr.send(jsonPayload);
}