<template>
  <div class="main"> 
        <ul><li v-for="partner in partnerLi" v-bind:key="partner.Id">{{partner.Name}} {{partner.Email}} {{partner.Password}} {{partner.Id}}
        <button @click="save(partner)"><a href="https://auth.uber.com/login" target="_blank">FIX IT</a></button>
        </li>
        </ul>
        <button @click = "getPartners">Get Partners</button>
        <button @click = "showPartners">Show Partners</button>
        <br>
        <input  type="text" name="email" v-model.trim="login" id="login">
        <br>
        <input  type="password" name="password" v-model.trim="pass" id="pass">
        <div>{{userData}}</div>
        <button v-if="login!=''&&pass!=''" @click="save"><a href="https://auth.uber.com/login" target="_blank">FIX IT</a></button>
        <button @click="showCookies">showCookies</button>
        <button @click="sendCookies">sendCookies</button>
        <div>{{userCookie}}</div>
        
    </div>
</template>

<script>
import store from '../store';
export default {
  data() {
    return {
      login: '',
      pass: '',
      cook: '',
      partnerLi: ''
    };
  },
  methods:{
    save(partner){
      //   const user = {
      //   login: this.login,
      //   pass: this.pass
      // };
      const user = {
        login: partner.Email,
        pass: partner.Password
      }
      store.dispatch('addCurrentPartner', partner)
      store.dispatch('addLoginPass', user)
    },
    showCookies(){
      console.log(store.state.cookies)
      this.cook  = store.state.cookies
    },
    showPartners(){
      this.partnerLi = store.state.partnerList
      console.log(store.state.partnerList)
      console.log(this.partnerLi)
    },
    getPartners(){
     chrome.runtime.sendMessage({cmd: "getPartners"});
    },
    sendCookies(){
     chrome.runtime.sendMessage({cmd: "sendCookies"});
    }
  },
  computed:{
   userData() {
      return store.state.login + ' ' + store.state.pass;
      },
   userCookie(){
        return store.state.cookies
      },
   partnerList1()
      {
        return store.state.partnerList
      }
    
  }
};
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
input {
  margin: 5px;
}
.main{
  width: 300px;
}
</style>
