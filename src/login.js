
import store from './store'
if (store.state.isEnabled) {
window.onload = (function () {

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
        
      console.log('successful geting id pass');
      clearInterval(intervalPass);
      console.log('stop interval')
    }
    console.log('trying get id pass')
  }, 500);

}
  