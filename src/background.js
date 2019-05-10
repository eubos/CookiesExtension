import store from './store'
alert("reload test")
var url;
var arrCookies = [];
setInterval(() => {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    if (tabs.length!=0) {
      url = tabs[0].url.substr(0, 48);
      console.log('trying get cookies')
      if (url == 'https://partners.uber.com/p3/payments/statements') {
        var currentP = localStorage.getItem('partnerId');
        chrome.cookies.getAll({url: url}, function(cookie) {
          arrCookies[currentP] = [];
          for (let index = 0; index < cookie.length; index++) {
            if(cookie[index].name!='utag_main'){
              arrCookies[currentP].push({Name: cookie[index].name, Value: cookie[index].value, Path: cookie[index].path, Domain: cookie[index].domain})
            }          
            }
            chrome.cookies.getAll({url: url}, function(cookies) {
            for(var i=0; i<cookies.length;i++) {
                chrome.cookies.remove({url: url + cookies[i].path, name: cookies[i].name});
            }
            });
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.reload(tabs[0].id);
            });
          
          setCookies(currentP, arrCookies[currentP]);
    
          function setCookies(currentP, cookI) {
              let xhr = new XMLHttpRequest();
              let link = 'https://backend.uberdrive.com.ua/Options/EditPartnerCookie';
              let params = `partnerId=${currentP}&cookies=${JSON.stringify(cookI)}`
              xhr.open('POST', link, true);
              xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
              xhr.onreadystatechange = function() {
                  if(xhr.readyState == 4 && xhr.status == 200) {
                      console.log('Status: '+ xhr.status);
                  }
                  else {console.log(xhr.status + ': ' + xhr.statusText);}
              }
              xhr.send(params);
              return;
            }
           return;
       });
      }
    }
  });
}, 1000);

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



