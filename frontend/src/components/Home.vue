<template>
    <div class="home">
        <h1>Kezdőoldal</h1>
        <p>Session Timeout: {{ formattedTime }}</p>
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
            sessionTimeout: 0,
            formattedTime: '',
            remainingTime: 0, //visszaszámlálás
            timer: null
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
            this.sessionTimeout = parseInt(document.cookie.split('; ').find(row => row.startsWith('sessionTimeout=')).split('=')[1]);
            this.remainingTime = this.sessionTimeout; //idozito kezdeti ertek
            this.timer = setInterval(this.countdown, 1000); //countdown inditasa
        },
        countdown() {
            if(this.remainingTime > 0) {
                this.remainingTime--;
                const perc = Math.floor(this.remainingTime / 60);
                const masodperc = this.remainingTime % 60;
                this.formattedTime = `${perc}:${masodperc < 10 ? '0' : ''}${masodperc}`;
            } else {
                clearInterval(this.timer); //idozito leallitasa
                console.log('Session Timeout!');
                this.logout();
            }
        }
    },
    created() {
        login.methods.checkLoginStatus();
        this.getSessionTimeout();
    },
}
</script>

<style src="./home.css"></style>
