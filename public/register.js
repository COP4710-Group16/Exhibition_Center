function doRegister()
{
    var usernameInput = document.getElementById("inputUsername").value;
    var passwordInput = document.getElementById("inputPassword").value;

    var jsonPayload = JSON.stringify({username : usernameInput, password : passwordInput});

    var xhr = new XMLHttpRequest();

    xhr.open("POST", "/api/register", true);

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
            window.location.href = "sign_up.html";
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