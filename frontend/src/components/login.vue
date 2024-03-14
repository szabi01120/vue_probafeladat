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
      accountId: ''
    };
  },
  
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:4000/login', this.loginForm);
        if (response.status === 200) {    
          console.log('Bejelentkezés sikeres!');
          // console.log('Két faktoros azonosítás szükséges:', response.data);
          if (response.data.showTwoFactor) { //backend dönti el, hogy kell e 2fa vagy sem, ha nem, akkor továbbenged
            this.showTwoFactor = true;          
            this.accountId = response.data.accountId;
          } else {
            document.cookie = `sessionId=${response.data.sessionId}`; //sessionId cookie létrehozása
            this.$router.push('/home').catch((e) => {console.log(e)});
          }
        }
      } catch (error) {
        console.error('Hiba történt a bejelentkezés során:', error.response.data);
        this.loginError = error.response.data;
      }
    },
    async verifyTwoFactor() {
      try {
        const response = await axios.post('http://localhost:4000/verify', {
          accountId: this.accountId,
          username: this.loginForm.username,
          verificationCode: this.verificationCode
        });
        if (response.status === 200) {    
          console.log('Két faktoros azonosítás sikeres!');
          document.cookie = `sessionId=${response.data.sessionId}`; //sessionId cookie frissítése

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
