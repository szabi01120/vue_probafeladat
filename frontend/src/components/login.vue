<template>
  <div class="login-system">
    <h2>Bejelentkezés</h2>
    <form @submit.prevent="login">
      <label for="username">Felhasználónév:</label>
      <input type="text" id="username" v-model="loginForm.username" required>
      <label for="password">Jelszó:</label>
      <input type="password" id="password" v-model="loginForm.password" required>
      <button type="submit">Bejelentkezés</button>
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
      isLoggedIn: false,
      loginError: ''
    };
  },
  created() {
    this.checkLoginStatus();
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:4000/login', this.loginForm);
        if (response.status === 200) {
          console.log('Bejelentkezés sikeres!');
          localStorage.setItem('isLoggedIn', true);
          document.cookie = `sessionId=${response.data.sessionId}`;
          this.isLoggedIn = true;
          this.$router.push('/home').catch((e) => {console.log(e)});
        }
      } catch (error) {
        console.error('Hiba történt a bejelentkezés során:', error.response.data);
        this.loginError = error.response.data;
      }
    },
    async checkLoginStatus() {
      const sessionId = document.cookie = "name=sessionId";
      if (sessionId) {
        try {
          const response = await axios.get('http://localhost:4000/checkLogin', {
            withCredentials: true
          });
          if (response.status === 200) {
            console.log('Bejelentkezve mint:', response.data.username);
            this.isLoggedIn = true;
          }
        } catch (error) {
          console.error(error.response.data);
        }
      }
    }
  },
};
</script>

<style src="./login.css"></style>
