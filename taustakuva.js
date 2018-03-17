function leadingZero(number) {
  return ("0" + number).slice(-2);
}

function refreshTime() {
  let date = new Date();
  let hours = leadingZero(date.getHours());
  let minutes = leadingZero(date.getMinutes());
  document.getElementById("time").innerHTML = hours + ":" + minutes;
}

function getStoragePath() {
  let date = new Date();
  return ("image_" + date.getFullYear() + leadingZero(date.getMonth() + 1) +
         leadingZero(date.getDate())).toString();
}

function getNewImage() {
  let url = images[Math.floor(Math.random()*images.length)];
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.onload = function (){
    if (xhr.status===200){
      reader.readAsDataURL(xhr.response);
    }
  };
  let reader = new FileReader();
  reader.onloadend = function () {
    let storageDate = getStoragePath();
    let t = {};
    t[storageDate] = reader.result;
    chrome.storage.local.set(t);
    loadImage();
  };
  xhr.send();
}

function loadImage() {
  let storageDate = getStoragePath();
  chrome.storage.local.get([storageDate], function(result) {
    if (Object.keys(result).length === 0 && result.constructor === Object) {
      getNewImage();
    } else {
      document.styleSheets[0].insertRule(
        "body::before { background-image: url('" +
        result[storageDate] + "'); }", 0);
    }
  });
}

function deleteOldImages() {
  chrome.storage.local.get(null, function(result) {
    let images = Object.keys(result);
    let deleteImages = []
    for (let i = 0; i < images.length; i++) {
      if (images[i] < getStoragePath()) {
        deleteImages.push(images[i]);
      }
    }
    chrome.storage.local.remove(deleteImages);
  });
}

window.addEventListener("DOMContentLoaded", function() {
  refreshTime();
  loadImage();
  deleteOldImages();
});

window.setInterval(function() {
  refreshTime();
}, 5000);
