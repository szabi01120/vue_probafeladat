<template>
  <div class="login-system">
    <h2>Bejelentkezés</h2>
    <form @submit.prevent="login">
      <label for="username">Felhasználónév:</label>
      <input type="text" id="username" v-model="loginForm.username" required>
      <label for="password">Jelszó:</label>
      <input type="password" id="password" v-model="loginForm.password" required>
      <button type="submit">Bejelentkezés</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      isLoggedIn: false // logged in status
    };
  },
  methods: {
    async login() {
      await axios.post('http://localhost:4000/login', this.loginForm)
        .then(response => {
          console.log(response.data);
          this.isLoggedIn = true;
        })
        .catch(error => {
          console.error('Hiba történt a bejelentkezés során:', error);
        });
    }
  }
};
</script>

<style src="./login.css"></style>
