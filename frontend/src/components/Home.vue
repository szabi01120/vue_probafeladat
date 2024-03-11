<template>
    <div class="home">
        <h1>Kezdőoldal</h1>
        <button @click="logout">Kijelentkezés</button>
    </div>
</template>

<script>
/* eslint-disable */
import login from '@/components/Login'

export default {
    name: 'Home',
    methods: {
        logout() {
            //delete sessionId 
            document.cookie = 'sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            //redirect
            return this.$router.push('/');
        }
    },
    created() {
        login.methods.checkLoginStatus();
    },
}
</script>

<style src="./home.css"></style>
