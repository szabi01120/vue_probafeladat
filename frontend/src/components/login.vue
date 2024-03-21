<template>
  <div class="login-system">
    <h2>Bejelentkezés</h2>
    <form @submit.prevent="showTwoFactor ? verifyTwoFactor() : login()">
      <label for="username">Felhasználónév:</label>
      <input type="text" id="username" v-model="loginForm.username" required>
      <label for="password">Jelszó:</label>
      <input type="password" id="password" v-model="loginForm.password" required>
      <div v-if="showTwoFactor">
        <label for="verificationCode">Két faktoros kód:</label>
        <input type="text" id="verificationCode" v-model="verificationCode" required>
      </div>
      <button type="submit">{{ showTwoFactor ? 'Ellenőrzés' : 'Bejelentkezés' }}</button>
      <p v-if="loginError" class="error-message">{{ loginError }}</p>
    </form>
  </div>
</template>

<script>
/* eslint-disable */
import axios from "axios";

export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      verificationCode: '',
      loginError: '',
      showTwoFactor: false,
      accountId: '',
      sessionTimeout : 0
    };
  },
  
  methods: {
    async login() {
      try {
        const response = await axios.post('http://192.168.0.133:4000/login', this.loginForm);
        if (response.status === 200) {    
          console.log('Bejelentkezés sikeres!');
          this.showTwoFactor = true;          
          this.accountId = response.data.accountId;
          this.loginError = ''; //meglévő hibaüzenet törlése a 2fa megjelenítésekor
        }
      } catch (error) {
        console.error('Hiba történt a bejelentkezés során:', error.response.data);
        this.loginError = error.response.data;
      }
    },
    async verifyTwoFactor() {
      try {
        const response = await axios.post('http://192.168.0.133:4000/verify', {
          accountId: this.accountId,
          username: this.loginForm.username,
          verificationCode: this.verificationCode
        });
        if (response.status === 200) {    
          console.log('Két faktoros azonosítás sikeres!');
          console.log(response.headers['x-session-timeout']);
          document.cookie = `sessionTimeout=${response.data.sessionTimeout}`; //sessiontimeout cookie 
          document.cookie = `sessionId=${response.data.sessionId}`; //sessionId cookie
          this.$router.push('/home').catch((e) => {console.log(e)});
        }
      } catch (error) {
        console.error('Hiba történt a két faktoros azonosítás során:', error.response.data);
        this.loginError = error.response.data;
      }
    },    
  },
};
</script>

<style src="./login.css"></style>
