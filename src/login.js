
import store from './store'
if (store.state.isEnabled) {
  document.addEventListener('DOMContentLoaded', function () {
    let body = document.getElementById('app-content');
    body.style.visibility = "hidden";
    body.style.textAlign = "center";
    let img = document.createElement("img");
    let h1 = document.createElement('h1');
    let background = document.createElement('div')
    background.style.width = '100%';
    background.style.height = '120%';
    background.style.display = 'absolute';
    background.style.visibility = 'visible'
    background.style.backgroundImage = "url('https://i.ibb.co/JyHJ931/UBERDRIVE-logo-white.jpg')"
    background.style.backgroundSize = 'cover';
    background.style.position = 'absolute'
    h1.innerHTML = 'Some magic happens'
    h1.style.visibility = "visible"
    h1.style.position = "absolute"
    h1.style.top = '0'
    h1.style.right = '0'
    h1.style.bottom = '0'
    h1.style.left = '0'
    h1.style.margin = 'auto'
    h1.style.color = '#a6a5a5'
    img.src = "https://www.hungarospa.hu/templates/hungarospa/themes/default/images/loading.gif";
    img.style.visibility = "visible"
    img.style.position = "absolute"
    img.style.top = '-20px'
    img.style.right = '0'
    img.style.left = '0'
    img.style.margin = 'auto'
    body.firstChild.appendChild(background);
    background.appendChild(h1);
    background.appendChild(img);
  }, false);
window.onload = (function () {
  setTimeout(() => {
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
          const recaptcha = document.getElementById('login-recaptcha');
          recaptcha.style.visibility = "visible"
          btn[0].style.visibility = "visible"
        }, 500);
  let loginCaptchaInterval = setInterval(() => {
    let checked = document.getElementsByClassName('solved_flag');
    console.log('console.log(checked);');
    console.log(checked);
    if (checked.length) {
      btn[0].click();
      console.log('click!');
      clearInterval(loginCaptchaInterval);
    }
  }, 2000);
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
            const recaptchaPass = document.getElementById('login-recaptcha');
            recaptchaPass.style.visibility = "visible"
            btn[0].style.visibility = "visible"
          }, 500);  
      //console.log('successful geting id pass');
      clearInterval(intervalPass);
      //console.log('stop interval')
    }
    //console.log('trying get id pass')
  }, 500);


  let intervalCode = setInterval(() => {
    if (document.getElementById('verificationCode') !== null) {
      clearInterval(intervalCode);
      chrome.runtime.sendMessage({cmd: "getCode"});
      localStorage.setItem('getMessageFlag', 0);
      let verificationCode = document.getElementById('verificationCode');
      let btn = document.getElementsByTagName('button');
      let intervalCode2 = setInterval(() => {
        if (+localStorage.getItem('getMessageFlag') ===  1) {
          clearInterval(intervalCode2)
          let code = localStorage.getItem('code');
          verificationCode.removeAttribute('value');
          verificationCode.setAttribute('value', code);
          verificationCode.value  = code;
          verificationCode.dispatchEvent(new Event("change", { bubbles: true }));
          verificationCode.dispatchEvent(new Event("blur", { bubbles: true }));
          setTimeout(() => {
            btn[0].click();
            const recaptchaPass = document.getElementById('login-recaptcha');
            recaptchaPass.style.visibility = "visible"
            btn[0].style.visibility = "visible"
          }, 500);  
        }
      }, 1000);
    }
  }, 3000);

}
  