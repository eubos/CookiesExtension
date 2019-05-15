<template>
<v-container fluid px-0 class="main" style="top: -20px">
 <v-layout row wrap align-center>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar color="black" dark>
          <v-switch large style="margin-top:20px"
          @change="setEnabled"
           v-model="$store.state.isEnabled"
           color="white"
           ></v-switch>
          <v-toolbar-title>Cookies extension</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
          :loading="loading"
          :disabled="loading || !$store.state.isEnabled"
          color="secondary"
          @click="getPartners"
          >
          Get Partners
          </v-btn>
        </v-toolbar> 
        <v-list v-if="$store.state.partnerList && $store.state.isEnabled">
          <v-list-tile
            v-for="partner in $store.state.partnerList"
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
        <h1 v-else>Extension off</h1>
        <v-footer class="pa-3" dark  height="auto" fixed app>
         <span class="body-2 white--text">Made with <v-icon color="red" small>favorite</v-icon> by UBERDRIVE TEAM</span>
         <v-spacer></v-spacer>
         <span class="body-2 white--text">&copy; {{ new Date().getFullYear() }}</span>
        </v-footer>
      </v-card>
    </v-flex>
   </v-layout>
</v-container>   
</template>

<script>
import store from '../store';
export default {
  data() {
    return {
      cook: '',
      loader: null,
      loading: false
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
    },
    setEnabled(){
     store.dispatch('setEnable', store.state.isEnabled)
     chrome.runtime.reload();
    }
  },

  watch:{
    loader () {
        const l = this.loader
        this[l] = !this[l]
        setTimeout(() => (this[l] = false), 2000)
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
  height: 800px;
}

</style>
