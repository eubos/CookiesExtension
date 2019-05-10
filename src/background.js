import store from './store'
alert("reload test")
var url;
var arrCookies = [];
const interval = setInterval(() => {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    url = tabs[0].url.substr(0, 48);
  });
  if (url == 'https://partners.uber.com/p3/payments/statements') {
    chrome.cookies.getAll({url: url}, function(cookie) {
      for (let index = 0; index < cookie.length; index++) {
        if(cookie[index].name!='utag_main'){
          arrCookies.push({Name: cookie[index].name, Value: cookie[index].value, Path: cookie[index].path, Domain: cookie[index].domain})
        }          
      }
      store.dispatch('addCookies', arrCookies);
      chrome.cookies.getAll({url: url}, function(cookies) {
        for(var i=0; i<cookies.length;i++) {
            chrome.cookies.remove({url: url + cookies[i].path, name: cookies[i].name});
        }
    });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.reload(tabs[0].id);
    });
   });
   clearInterval(interval);
  }
}, 2000);


chrome.runtime.onMessage.addListener(function (request) {
  if (request.cmd === "getPartners") {
    (function loadPartners() {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://backend.uberdrive.com.ua/services/GetPartnersForCookieExtension', true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
          alert(xhr.status + ': ' + xhr.statusText);
        } else {
          try {
            var partners = JSON.parse(xhr.responseText);
          } catch (e) {
            alert("Некорректный ответ " + e.message);
          }
          showPartners(partners);
        }

      }
      xhr.send();
    }());
    function showPartners(partners) {
      store.dispatch('addPartners', partners);
    }
}});

chrome.runtime.onMessage.addListener(function (request) {
  if (request.cmd === "sendCookies") {
    (function loadPartners() {
    var currentP = localStorage.getItem('partnerId');
      let cookI = JSON.stringify(store.state.cookies);
      let xhr = new XMLHttpRequest();
      let url = 'https://backend.uberdrive.com.ua/Options/EditPartnerCookie';
      let params = `partnerId=${currentP}&cookies=${cookI}`
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.onreadystatechange = function() {
          if(xhr.readyState == 4 && xhr.status == 200) {
              alert(xhr.responseText);
          }
          else alert(xhr.status + ': ' + xhr.statusText);
      }
      xhr.send(params);
    }());
}});



