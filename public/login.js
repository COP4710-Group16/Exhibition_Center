var userID = -1;
var email = "";

function doLogin()
{
    var usernameInput = document.getElementById("inputUsername").value;
    var passwordInput = document.getElementById("inputPassword").value;

    var jsonPayload = JSON.stringify({username : usernameInput, password : passwordInput});

    var xhr = new XMLHttpRequest();

    xhr.open("POST", "/api/login", true);

    //xhr.setRequestHeader('Access-Control-Allow-Origin', 'http://206.189.193.36/');
    //xhr.setRequestHeader('Access-Control-Allow-Credentials', 'true');
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.send(jsonPayload);

    // Is called when xhr finishes the request
    xhr.onload = function() {
        if(xhr.status == 500)
        {
            alert(`500 internal server error`);
        } 
        else if(xhr.status == 200)
        {
            var jsonObject = JSON.parse(xhr.response);
            userID = jsonObject.userID;
            if(userID != -1)
            {
                saveCookie();
                window.location.href = "user_home.html";
            }
        }
        else
        {
            alert(xhr.status);
        }
    };
    xhr.onerror = function() { // only triggers if the request couldn't be made at all
        alert("Network error");
    };

    //Only needed for network testing
    /*
    xhr.onprogress = function(event) { // triggers periodically
        // event.loaded - how many bytes downloaded
        // event.lengthComputable = true if the server sent Content-Length header
        // event.total - total number of bytes (if lengthComputable)
        alert(`Received ${event.loaded} of ${event.total}`);
    };
    */
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
    date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "userid=" + userID + ";expires=" + date.toGMTString();
}