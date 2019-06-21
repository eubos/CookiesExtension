<template>
<v-container fluid px-0 class="main" style="top: -20px; padding: 0px;">
      <v-card>
        <v-tabs
      v-model="active"
      color="black"
      dark
      slider-color="yellow"
      centered
    >
      <v-tab
        :key="1"
        ripple
      >
        FIX FAILED
      </v-tab>
      <v-tab
        :key="2"
        ripple
      >
        FIX ANY
      </v-tab>
      <v-tab
        :key="3"
        ripple
      >
        ENTER IN PARTNER
      </v-tab>
      <v-tab-item
        :key="1"
      >
        <v-card flat>
            <v-list style="padding: 0px" v-if="$store.state.partnerList && $store.state.isEnabled">
            <v-list-tile
            v-for="partner in $store.state.partnerList"
            :key="partner.Id"
            avatar
            dark
            >
            <v-list-tile-content>
              <v-list-tile-title v-text="partner.Name"></v-list-tile-title>
            </v-list-tile-content>
            <v-btn large color="error" @click="save(partner)">FIX IT</v-btn>
          </v-list-tile>
          </v-list>
          <v-flex v-else xs12 sm4 text-xs-center><h1>Extension off</h1></v-flex>
        </v-card>
      </v-tab-item>
      <v-tab-item
        :key="2"
      >
        <v-card flat>
            <v-btn @click="getAllPartners" color="black" dark>Get All Partners</v-btn>
            <v-text-field v-model="search" class="form-control" style="display: inline-flex; width: 50%;" label="Filter partners by name"></v-text-field>
            <v-list style="padding: 0px" v-if="$store.state.allPartnersList && $store.state.isEnabled">
            <v-list-tile
            v-for="partner in filteredUsers"
            :key="partner.Id"
            avatar
            dark
            >
            <v-list-tile-content>
              <v-list-tile-title v-text="partner.Name"></v-list-tile-title>
            </v-list-tile-content>
            <v-btn large color="error" @click="save(partner)">FIX IT</v-btn>
          </v-list-tile>
          </v-list>
          <v-flex v-else xs12 sm4 text-xs-center><h1>Extension off</h1></v-flex>
        </v-card>
      </v-tab-item>
      <v-tab-item
        :key="3"
      >
        <v-card flat>
         <v-btn @click="getAllPartners" color="black" dark>Get All Partners</v-btn>
            <v-text-field v-model="search" class="form-control" style="display: inline-flex; width: 50%;" label="Filter partners by name"></v-text-field>
            <v-list style="padding: 0px" v-if="$store.state.allPartnersList && $store.state.isEnabled">
            <v-list-tile
            v-for="partner in filteredUsers"
            :key="partner.Id"
            avatar
            dark
            >
            <v-list-tile-content>
              <v-list-tile-title v-text="partner.Name"></v-list-tile-title>
            </v-list-tile-content>
            <v-btn large color="error" @click="enter(partner)">Enter</v-btn>
          </v-list-tile>
          </v-list>
          <v-flex v-else xs12 sm4 text-xs-center><h1>Extension off</h1></v-flex>
        </v-card>
      </v-tab-item>
    </v-tabs>

        <v-footer class="pa-3" dark  height="30px" fixed app>
         <v-switch large style="margin-top:20px"
          @change="setEnabled"
           v-model="$store.state.isEnabled"
           color="white"
           ></v-switch>
          <v-spacer></v-spacer>
          <v-btn
          :loading="loading"
          :disabled="loading || !$store.state.isEnabled"
          color="secondary"
          @click="getPartners"
          >
          Get failed Partners
          </v-btn>
          <v-btn
          @click="getCode"
          >
          Get Code
          </v-btn>
          <v-btn
          :loading="loading"
          :disabled="loading || !$store.state.isEnabled"
          @click="fixAll"
          >
          FIX ALL failed
          </v-btn>
        </v-footer>
      </v-card>
</v-container>   
</template>

<script>
import store from '../store';
export default {
  data() {
    return {
      cook: '',
      loader: null,
      loading: false,
      search: ''
    };
  },
  methods:{
    save(partner){
      window.open('https://auth.uber.com/login', '_blank');
      const user = {
        login: partner.Email,
        pass: partner.Password
      }
      store.dispatch('addCurrentPartner', partner)
      store.dispatch('addLoginPass', user)
      localStorage.setItem('onEnter', false)
    },
    enter(partner){
      window.open('https://auth.uber.com/login', '_blank');
      const user = {
        login: partner.Email,
        pass: partner.Password
      }
      store.dispatch('addCurrentPartner', partner);
      store.dispatch('addLoginPass', user);
      localStorage.setItem('onEnter', true)      
    },
    fixAll(){
      this.loader = 'loading';
      chrome.runtime.sendMessage({cmd: "fixAll"});
      localStorage.setItem('onEnter', false)
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
    },
    getCode(){
      chrome.runtime.sendMessage({cmd: "getCode"});
    },
    getAllPartners(){
      chrome.runtime.sendMessage({cmd: "getAllPartners"});
    }
  },
  computed:{
    sortedUsers(){
      return store.state.allPartnersList;
    },
    filteredUsers() {
      const s = this.search.toLowerCase();
      return this.sortedUsers.filter(n => Object.values(n).some(m => m.toString().toLowerCase().includes(s)));
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
  min-height: 600px;
}

</style>
