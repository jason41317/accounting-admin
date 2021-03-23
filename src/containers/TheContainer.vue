<template>
  <div class="c-app">
    <loading
      :can-cancel="false" 
      :is-full-page="true"
      :active.sync="isLoggingOut"
      lock-scroll
      loader="spinner"
      color="#0A76EC" >
    </loading>
    <TheSidebar/>
    <CWrapper>
      <TheHeader @onLogoutUser="onLogoutUser"/>
      <div class="c-body">
        <main class="c-main">
          <CContainer fluid>
            <transition name="fade" mode="out-in">
              <router-view :key="$route.path"></router-view>
            </transition>
          </CContainer>
        </main>
      </div>
      <TheFooter/>
    </CWrapper>
  </div>
</template>

<script>
import TheSidebar from './TheSidebar'
import TheHeader from './TheHeader'
import TheFooter from './TheFooter'
import { AuthApi } from '../mixins/api'

export default {
  name: 'TheContainer',
  mixins: [AuthApi],
  components: {
    TheSidebar,
    TheHeader,
    TheFooter
  },
  data() {
    return {
      isLoggingOut: false
    }
  },
  created() {
    this.loadProfile()
  },
  methods: {
    loadProfile() {
      this.getAuthenticatedUser().then(({ data }) => {
        this.$store.commit('SET_USER', data);
      }).catch((error) => {
        this.$router.push({ path: '/login' });
      })
    },
    onLogoutUser() {
      this.isLoggingOut = true
      this.revokeAuthentication().then(({ data }) => {
        this.$store.commit('LOGOUT_USER');
        this.$router.push({ path: '/login' });
        localStorage.clear()
        setTimeout(() => {
          this.$store.commit('LOGOUT_USER');
          this.$router.push({ path: '/login' });
          localStorage.clear()
          this.isLoggingOut = false
        }, 1500);
        
      }).catch(error => {
        const errors = error.response.data.errors
        this.isLoggingOut = false
      })
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
