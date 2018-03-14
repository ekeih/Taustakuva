function refreshTime() {
  function leadingZero(number) {
    return ("0" + number).slice(-2);
  }
  var date = new Date();
  var hours = leadingZero(date.getHours());
  var minutes = leadingZero(date.getMinutes());
  var day = leadingZero(date.getDate());
  var month = leadingZero(date.getMonth() + 1);
  var year = date.getFullYear();
  document.getElementById("time").innerHTML = hours + ":" + minutes;
  document.getElementById("date").innerHTML = day + "." + month + "." + year;
}

window.addEventListener("DOMContentLoaded", function() {
  refreshTime();

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      var fakeHTML = document.createElement("body");
      fakeHTML.innerHTML = xmlHttp.responseText;
      var a = fakeHTML.getElementsByTagName("a")[1];
      var url = a.href.replace("chrome-extension://" + chrome.runtime.id, "https://apod.nasa.gov");
      document.body.style.background = "black url('" + url + "') no-repeat fixed center";
      document.body.style.backgroundSize = "cover";
    }
  }
  xmlHttp.open("GET", "https://apod.nasa.gov/apod/astropix.html", true);
  xmlHttp.send();
});

window.setInterval(function() {
  refreshTime();
}, 5000);
