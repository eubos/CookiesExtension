
import store from './store'
if (store.state.isEnabled) {
window.onload = (function () {
  //start build manager version of extension
  // let body = document.getElementById('app-content');
  // let recaptcha = document.getElementById('login-recaptcha');
  // body.style.visibility = "hidden";
  // body.style.display = "none";
  // let h1 = document.createElement('h1');
  // h1.innerHTML = 'Some magic happens...';
  // h1.style.visibility = "visible"
  // h1.style.display= "block"
  // body.appendChild(h1);
  //  if (recaptcha.firstChild) {
  //  recaptcha.style.visibility = "visible"
  //  recaptcha.style.display= "block"
  //  }
    let log = document.getElementById('useridInput');
    let btn = document.getElementsByTagName('button');
    chrome.storage.sync.get(['login1'], function(result) {
      log.removeAttribute('value');
      log.setAttribute('value', result.login1);
      log.value  = result.login1;
      log.dispatchEvent(new Event("change", { bubbles: true }));
      log.dispatchEvent(new Event("blur", { bubbles: true }));
    });
        setTimeout(() => {
          btn[0].click();
        }, 500);  
  })
  
  let intervalPass = setInterval(() => {
    if (document.getElementById('password') !== null) {
      let pass = document.getElementById('password')
      let btn = document.getElementsByTagName('button');
      chrome.storage.sync.get(['password'], function(result) {
        pass.removeAttribute('value');
        pass.setAttribute('value', result.password);
        pass.value  = result.password;
        pass.dispatchEvent(new Event("change", { bubbles: true }));
        pass.dispatchEvent(new Event("blur", { bubbles: true }));
      });
          setTimeout(() => {
            btn[0].click();
          }, 500);  
      //console.log('successful geting id pass');
      clearInterval(intervalPass);
      //console.log('stop interval')
    }
    //console.log('trying get id pass')
  }, 500);

}
  