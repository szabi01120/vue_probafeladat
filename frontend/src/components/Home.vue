<template>
    <div class="home">
        <h1>Kezdőoldal</h1>
        <p>Session Timeout: {{ sessionTimeout }}</p>
        <button @click="logout">Kijelentkezés</button>
    </div>
</template>

<script>
/* eslint-disable */
import login from '@/components/Login'
import axios from 'axios';

export default {
    data() {
        return {
            sessionTimeout: ''
        }
    },
    name: 'Home',
    methods: {
        async logout() {
            await axios.post('http://localhost:4000/logout', {}, {
                headers: {
                    'X-Session-Id': document.cookie.split('; ').find(row => row.startsWith('sessionId=')).split('=')[1], //sessionId felküldése
                },
                withCredentials: true
            }).then((response) => {
                //document.cookie = 'sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; 
                console.log(response.status, response.data);
                
                this.$router.push('/').catch((e) => {console.log(e)});
            }).catch((error) => {
                console.error('Hiba történt a kijelentkezés során:', error.response.data);
            });
        },
        async getSessionTimeout() {
            await axios.get('http://localhost:4000/checkLogin', {
                headers: {
                    'X-Session-Id': document.cookie.split('; ').find(row => row.startsWith('sessionId=')).split('=')[1],
                },
                withCredentials: true
            }).then((response) => {
                console.log(response.headers['x-session-timeout']);
                this.sessionTimeout = response.headers['x-session-timeout'];
            }).catch((error) => {
                console.error('Hiba történt a session timeout lekérdezésekor:', error.response.data);
            });
        }
    },
    created() {
        login.methods.checkLoginStatus();
        this.getSessionTimeout();
    },
}
</script>

<style src="./home.css"></style>
