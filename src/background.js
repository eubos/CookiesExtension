import store from './store'
alert("reload test")
var url;
var arrCookies = [{PartnerId:'', ParnterName:'',Cookies:[]}];
const interval = setInterval(() => {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    url = tabs[0].url.substr(0, 48);
    console.log(url);
  });
  if (url == 'https://partners.uber.com/p3/payments/statements') {
    chrome.cookies.getAll({url: url}, function(cookie) {
      console.log(cookie);
      console.log('store.state.currentPartner.Name');
      console.log(store.state.currentPartner.Name);
      arrCookies[0].PartnerId = store.state.currentPartner.Id;
      arrCookies[0].ParnterName = store.state.currentPartner.Name;
      for (let index = 0; index < cookie.length; index++) {
          arrCookies[0].Cookies.push({Name: cookie[index].name, Value: cookie[index].value, Path: cookie[index].path, Domain: cookie[index].domain})
      }
      console.log('arrCookies');
      console.log(arrCookies);
      store.dispatch('addCookies', arrCookies);
      chrome.cookies.getAll({url: url}, function(cookies) {
        console.log(url);
        for(var i=0; i<cookies.length;i++) {
            chrome.cookies.remove({url: url + cookies[i].path, name: cookies[i].name});
        }
        console.log('cookies after remove')
        console.log(cookies)
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
    console.log('111')

    (function loadPartners() {
      console.log('222')
      var xhr = new XMLHttpRequest();

      xhr.open('GET', 'https://backend.uberdrive.com.ua/services/GetPartnersForCookieExtension', true);

      xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
          // обработать ошибку
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
      console.log('333')
      console.log(partners)
      console.log(store.state)
      store.dispatch('addPartners', partners);
      //   partners.forEach(function(phone) {
          
      //   var li = list.appendChild(document.createElement('li'));
      //   li.innerHTML = phone.name;
      // });

    }

}});



chrome.runtime.onMessage.addListener(function (request) {
  if (request.cmd === "sendCookies") {
    console.log('111')

    (function loadPartners() {
      console.log('222')
      var xhr = new XMLHttpRequest();

      xhr.open('POST', 'https://backend.uberdrive.com.ua/Options/EditPartnerCookie', true);
      xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
          // обработать ошибку
          alert(xhr.status + ': ' + xhr.statusText);
        } else {
          try {
            var partners = JSON.parse(xhr.responseText);
          } catch (e) {
            alert("Некорректный ответ " + e.message);
          }
    
        }

      }
      xhr.send(store.state.cookies);
    }());
}});



