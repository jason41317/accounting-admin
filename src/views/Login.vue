<template>
 <div class="login__container">
   <div class="jdev">Powered By: JDEV OFFICE SOLUTION</div>
   <div class="login-form__container">
    <div class="left-pane">
      <div class="left-pane__logo-container">
        <img class="company-logo" src="https://st2.depositphotos.com/2100659/6768/v/950/depositphotos_67686065-stock-illustration-lorem-ipsum-abstract-vector-logo.jpg" alt="">
        <div class="left-pane__message">Please login your account.</div>
      </div>
      <div class="left-pane__login-form-container">
        <b-form-group
          :invalid-feedback="forms.auth.errors.username">
          <b-form-input
            v-model="forms.auth.fields.username"
            :state="forms.auth.states.username"
            class="login-input"
            placeholder="Username"
            @keyup.enter="authLogin()"
            :disabled="forms.auth.isProcessing" />
        </b-form-group>
        <b-form-group
          :invalid-feedback="forms.auth.errors.password">
          <b-form-input
            v-model="forms.auth.fields.password"
            :state="forms.auth.states.password"
            class="login-input"
            placeholder="Password" 
            type="password"
            @keyup.enter="authLogin()"
            :disabled="forms.auth.isProcessing" />
        </b-form-group>
        <b-button
          @click="authLogin()"
          pill 
          class="login-button"
          variant="outline-primary"
          :disabled="forms.auth.isProcessing" >
          <v-icon 
            v-if="forms.auth.isProcessing"
            name="sync"
            spin
            class="mr-2"/>
            Login
        </b-button>
      </div>
    </div>
    <div class="right-pane">
      <LoginSvg class="login-svg"/>
      <div class="login-greetings">WELCOME BACK !</div>
      <div class="login-message">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem libero culpa temporibus corporis laborum at explicabo assumenda reprehenderit rerum in!.</div>
    </div>
   </div>
 </div>
</template>

<script>
const fields = {
  username: null,
  password: null
}
import LoginSvg from '../assets/svg/Login.svg'
import { reset, validate } from '../helpers/forms'
import { AuthApi } from '../mixins/api'
export default {
  name: 'Login',
  components: {
    LoginSvg
  },
  mixins: [AuthApi],
  data() {
    return {
      forms: {
        auth: {
          isProcessing: false,
          fields: {...fields},
          states: {...fields},
          errors: {...fields}
        }
      },
    }
  },
  methods: {
    authLogin(){
      const { auth, auth: { fields: { username, password } } } = this.forms;
      auth.isProcessing = true;
      reset(auth)
      this.login({ username, password })
        .then(({ data }) => {
          this.$store.commit('LOGIN_USER')
          localStorage.setItem('accessToken', data.accessToken)
          this.getAuthenticatedUser()
            .then(({ data }) => {
              this.$router.push({ name: 'Dashboard'})
              setTimeout(() => {
                auth.isProcessing = false;
              }, 1000);
              
            })
        }).catch((error) => {
          console.log(error)
          auth.isProcessing = false;
          const { errors } = error.response.data;
          validate(auth, errors);
        })
    },
  }
}
</script>

<style lang="scss" scoped>
  .login__container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: rgb(189, 184, 184);
  }

  .login-form__container {
    width: 800px;
    min-height: 500px;
    height: auto;
    -webkit-box-shadow: 0px 0px 5px 3px #157D1A; 
    box-shadow: 0px 0px 5px 3px #157D1A;
    background-color: white;
    border-radius: 3px;
    display: flex;
  }

  .left-pane {
    width: 320px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 10px;
  }

  .right-pane {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 30px;
    background-color: rgb(20, 80, 38);
    flex-direction: column;
  }

  .login-svg {
    width: 70%;
    height: 70%;
  }

  .login-message{
    color: white;
    font-size: 9pt;
    text-align: center;
  }

  .login-greetings {
    color: white;
    font-size: 18pt;
    text-align: center;
    font-weight: bold;
  }

  .company-logo {
    width: 70%;
    height: auto;
  }

  .left-pane__message {
    font-size: 10pt;
    text-align: center;
    color: gray;
    margin-top: 10px;
  }

  .left-pane__logo-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 240px;
    width: 100%;
  }

  .left-pane__login-form-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
    width: 100%;
  }

  .login-input{
    // margin: 5px 0;
    font-size: 10pt;

  }

  .login-button {
    margin-top: 15px;
    background: rgb(131,187,75);
    background: linear-gradient(302deg, rgba(131,187,75,0.8323704481792717) 0%, rgba(34,154,11,1) 10%, rgba(18,77,8,1) 87%);
    border: solid 1px rgb(131,187,75);
    width: 150px;
    align-self: center;
    color: white;
  }

  .jdev {
    position: absolute;
    bottom: 10px;
    left: 10px;
    font-weight: bold;
    color: rgb(1, 1, 71);
  }

  @media screen and (max-width: 850px) {
    .login-form__container {
      width: 650px;
      height: 400px;
    }

    .company-logo {
      width: 60%;
      height: auto;
    }

    .left-pane {
      width: 260px;
    }
  }

  @media screen and (max-width: 700px ) {
    .login-form__container {
      width: 550px;
      height: 400px;
    }
  }

  @media screen and (max-width: 600px ) {
    .login-form__container {
      width: 480px;
      height: 400px;
    }
  }

  @media screen and (max-width: 500px ) {
    .login__container {
      padding: 20px;
    }
    .left-pane {
      width: 100%;
    }

    .login-form__container {
      width: 100%
    }

    .right-pane {
      display: none;
    }

    .company-logo {
      width: 40%;
      height: auto;
    }

    .left-pane__login-form-container {
      width: 80%;
    }
  }
</style>