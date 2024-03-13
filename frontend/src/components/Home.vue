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
                console.log(response.status, response.data);
                
                this.$router.push('/').catch((e) => {console.log(e)});
            }).catch((error) => {
                console.error('Hiba történt a kijelentkezés során:', error.response.data);
            });
        },
        async getSessionTimeout() {
            const response = await axios.get('http://localhost:4000/checkLogin', {
                headers: {
                    'X-Session-Id': document.cookie.split('; ').find(row => row.startsWith('sessionId=')).split('=')[1],
                },
                withCredentials: true
            });
            console.log(response.headers['X-Session-Timeout']);
            console.log(response.headers);
            this.sessionTimeout = response.headers['x-session-timeout'];
        }
    },
    created() {
        login.methods.checkLoginStatus();
        this.getSessionTimeout();
    },
}
</script>

<style src="./home.css"></style>
