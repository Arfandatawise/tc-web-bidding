// popup.js

document.addEventListener('DOMContentLoaded', function() {
  var sendDataButton = document.getElementById('sendData');
  sendDataButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'sendData' });
    });
  });

  function carDetail()
  {
    alert("ok");
    console.log("ok");
  }
});

// document.getElementsByClassName("gallery").addEventListener('click',function()
// {
//   console.log("ok")
// })
// document.querySelectorAll("#list .row_box")