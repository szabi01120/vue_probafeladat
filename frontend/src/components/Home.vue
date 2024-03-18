<template>
    <div class="home">
        <h1>Kezdőoldal</h1>
        <p>Session Timeout: {{ formattedTime }}</p>
        <button @click="logout">Kijelentkezés</button>
    </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';

export default {
    data() {
        return {
            sessionTimeout: 0,
            formattedTime: '30:00',
            remainingTime: 0, //visszaszámlálás
            timer: null
        }
    },
    name: 'Home',
    methods: {
        async logout() {
            let sessionId = '';
            try { //sessionId cookie kiolvasása
                sessionId = document.cookie.split('; ').find(row => row.startsWith('sessionId=')).split('=')[1];
            } catch (e) { sessionId = ''; }

            await axios.post('http://192.168.0.133:4000/logout', {}, {
                headers: {
                    'X-Session-Id': sessionId //sessionId felküldése
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
        },
        async checkLoginStatus() {
            let sessionId = '';
            try { //sessionId cookie kiolvasása
                sessionId = document.cookie.split('; ').find(row => row.startsWith('sessionId=')).split('=')[1];
            } catch (e) { sessionId = ''; }
                
            if (sessionId.length > 0) {
                try {
                    const response = await axios.get('http://192.168.0.133:4000/checkLogin', {
                    headers: {
                    'x-session-id': sessionId,
                    },
                    withCredentials: true
                });
                if (response.status === 200) {
                    //const sessionTimeout = response.headers['x-session-timeout'];
                    console.log('resp data:', response.data);
                    console.log('Bejelentkezve mint:', response.data.username);
                }
                } catch (error) {
                console.error(error.response.data);
                }
            } else {
                this.$router.push('/').catch((e) => {console.log(e)});
            }
        }
    },    
    created() {
        this.checkLoginStatus();
        this.getSessionTimeout();
    },
}
</script>

<style src="./home.css"></style>
