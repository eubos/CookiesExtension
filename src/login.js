window.onload = (function () {
  let log = document.getElementById('useridInput');
  let btn = document.getElementsByTagName('button');
  console.log(btn[0]);
  chrome.storage.sync.get(['login1'], function(result) {
    log.removeAttribute('value');
    log.setAttribute('value', result.login1);
    log.value  = result.login1 + '?';
  });
  log.addEventListener('keydown', handler);
  function handler(event){
    if (event.code == 'Backspace') {
      setTimeout(() => {
        btn[0].click();
      }, 500);  
    }
  };
  })
  
  let intervalPass = setInterval(() => {
    if (document.getElementById('password') !== null) {
      var pass = document.getElementById('password')
      console.log(pass)
      var btn = document.getElementsByTagName('button');
      console.log(btn[0]);
      chrome.storage.sync.get(['password'], function(result) {
        pass.removeAttribute('value');
        pass.setAttribute('value', result.password);
        pass.value  = result.password + '?';
      });
      pass.addEventListener('keydown', handler);
      function handler(event){
        if (event.code == 'Backspace') {
          setTimeout(() => {
            btn[0].click();
          }, 1000);  
        }
      };
      console.log('successful geting id pass');
      clearInterval(intervalPass);
      console.log('stop interval')
    }
    console.log('trying get id pass')
  }, 500);


  