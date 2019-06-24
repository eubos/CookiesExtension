import store from './store'

var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = "https://apis.google.com/js/api.js";
head.appendChild(script);



chrome.runtime.onMessage.addListener(function (request) {
  if (request.cmd === "getCode") {
    //get token
    var apiKey = ''
    var email = ''
    chrome.identity.getAuthToken({interactive: true}, function(token) {
            var x = new XMLHttpRequest();
            x.open('GET', `https://www.googleapis.com/gmail/v1/users/${email}/messages?key=${apiKey}`);
            x.setRequestHeader('Authorization', 'Bearer ' + token);
            x.setRequestHeader('Accept', 'application/json');
            x.onreadystatechange = function() {
              if (x.readyState != 4) return;
              if (x.status != 200) {
                alert(x.status + ': ' + x.statusText);
              } else {
                try {
                  var messagesList = JSON.parse(x.responseText);
                  console.log(messagesList);
                } catch (e) {
                  alert("Некорректный ответ " + e.message);
                }
              }
            }
            x.send();
      })
}})

var url;
var arrCookies = [];
setTimeout(() => {
  loadPartners2();
}, 1000);

chrome.browserAction.setBadgeText({'text': store.state.partnerList.length+''}, function(){
})
chrome.runtime.sendMessage({cmd: "getPartners"});
setInterval(() => {
  console.log(localStorage.getItem('onEnter'));
  if (store.state.isEnabled && localStorage.getItem('onEnter') == 'false') {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    if (tabs.length!=0) {
      url = tabs[0].url.substr(0, 48);
      //console.log('trying get cookies')
      if (url == 'https://partners.uber.com/p3/payments/statements' || url == 'https://partners.uber.com/p3/payments/weekly-ear') {
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
            chrome.tabs.remove(tabs[0].id);
            });
          setCookies(currentP, arrCookies[currentP]);
          
          function setCookies(currentP, cookI) {
              let xhr = new XMLHttpRequest();
              //test method that don't reload jobs
              //let link = 'https://backend.uberdrive.com.ua/Options/EditPartnerCookie';
              let link = 'https://backend.uberdrive.com.ua/Options/EditPartnerCookieAndRestart';
              let params = `partnerId=${currentP}&cookies=${JSON.stringify(cookI)}`
              xhr.open('POST', link, true);
              xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
              xhr.onreadystatechange = function() {  
                if (xhr.status == 200) {
                  loadPartners2();
                }
              }
              xhr.send(params);
              return;
            }
           return;
       });
      }
    }
  });
}
}, 1000);


function loadPartners2(){
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
      console.log("console.log(localStorage.getItem('inProgress'));");
      console.log(localStorage.getItem('inProgress'));
      showPartners2(partners);
    }
  }
  xhr.send();
}
function showPartners2(partners) {
  store.dispatch('addPartners', partners);
}

chrome.runtime.onMessage.addListener(function (request) {
  if (request.cmd === "getPartners") {
    function loadPartners() {
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
          reloadExtension();
        }
      }
      xhr.send();
    };
    loadPartners();
    function showPartners(partners) {
      store.dispatch('addPartners', partners);
    }
    function reloadExtension(){
      chrome.runtime.reload();
    }
}});

chrome.runtime.onMessage.addListener(function (request) {
  if (request.cmd === "getAllPartners") {
    function loadPartners() {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://backend.uberdrive.com.ua/services/GetAllPartners', true);
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
          reloadExtension();
        }
      }
      xhr.send();
    };
    loadPartners();
    function showPartners(partners) {
      store.dispatch('addAllPartners', partners);
    }
    function reloadExtension(){
      chrome.runtime.reload();
    }
}});



chrome.runtime.onMessage.addListener(function (request) {
  if (request.cmd === "fixAll") {
    localStorage.setItem('inProgress', false);
    const interval = setInterval(() => {
      const i = 0;
      if (localStorage.getItem('inProgress') == 'false') {
        localStorage.setItem('inProgress', true);
      if (store.state.partnerList.length<1) {
        console.log('circle BREAKING');
        chrome.browserAction.setBadgeText({'text': store.state.partnerList.length+''}, function(){
        })
        clearInterval(interval);
        return;
      }
      chrome.browserAction.setBadgeText({'text': store.state.partnerList.length+''}, function(){
      })
      console.log(store.state);
        const user = {
        login: store.state.partnerList[i].Email,
        pass: store.state.partnerList[i].Password
        }
      store.dispatch('addLoginPass', user);
      store.dispatch('addCurrentPartner', store.state.partnerList[i]);
      console.log('partnerList.length ' + store.state.partnerList.length);
      if (localStorage.getItem('inProgress') == 'true'){
        window.open('https://auth.uber.com/login', '_blank');
      }
      }
      }, 3000);
}});


