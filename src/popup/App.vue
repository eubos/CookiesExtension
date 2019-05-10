<template>
<div class="main"> 
 <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar color="black" dark>
          <v-toolbar-title>Cookies extension</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
          :loading="loading"
          :disabled="loading"
          color="secondary"
          @click="getPartners"
          >
          Get Partners
          </v-btn>
        </v-toolbar>  
        <v-list v-if="partnerList.length">
          <v-list-tile
            v-for="partner in partnerList"
            :key="partner.Id"
            avatar
            dark
          >
            <v-list-tile-content>
              <v-list-tile-title v-text="partner.Name"></v-list-tile-title>
            </v-list-tile-content>

            <v-btn large color="error" @click="save(partner)" href="https://auth.uber.com/login" target="_blank">FIX IT</v-btn>
          </v-list-tile>
        </v-list>
        <v-footer class="pa-3" dark  height="auto" fixed app>
         <span class="body-2 white--text">Made with <v-icon color="red" small>favorite</v-icon> by UBERDRIVE TEAM</span>
         <v-spacer></v-spacer>
         <div>&copy; {{ new Date().getFullYear() }}</div>
        </v-footer>
      </v-card>
    </v-flex>
   </v-layout>        
  </div>
</template>

<script>
import store from '../store';
export default {
  data() {
    return {
      cook: '',
      loader: null,
      loading: false,
      partnerList: store.state.partnerList
    };
  },
  methods:{
    save(partner){
      const user = {
        login: partner.Email,
        pass: partner.Password
      }
      store.dispatch('addCurrentPartner', partner)
      store.dispatch('addLoginPass', user)
    },
    getPartners(){
     this.loader = 'loading';
     chrome.runtime.sendMessage({cmd: "getPartners"});
    },
    sendCookies(){
     chrome.runtime.sendMessage({cmd: "sendCookies"});
    }
  },
  computed:{
    // partnerList()
    //   {
    //     return store.state.partnerList
    //   }
  },
  watch:{
    loader () {
        const l = this.loader
        this[l] = !this[l]
        setTimeout(() => (this[l] = false), 3000)
        this.loader = null
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
  width: 500px;
  height: 600px;
}
</style>
