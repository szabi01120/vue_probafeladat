<template>
    <div class="login-system">
      <h2>Regisztráció</h2>
      <form @submit.prevent="register">
        <label for="newUsername">Felhasználónév:</label>
        <input type="text" id="newUsername" v-model="registerForm.username" required>
        <label for="newPassword">Jelszó:</label>
        <input type="password" id="newPassword" v-model="registerForm.password" required>
        <button type="submit">Regisztráció</button>
      </form>

      <p>Már van fiókod? <router-link to="/">Bejelentkezés</router-link></p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        registerForm: {
          username: '',
          password: ''
        }
      };
    },
    methods: {
      login() {
        // Handle login logic here
        console.log('Logging in with:', this.loginForm);
      },
      register() {
        // Handle registration logic here
        console.log('Registering with:', this.registerForm);
      }
    }
  };
  </script>
  
  <style src="./register.css"></style>
  