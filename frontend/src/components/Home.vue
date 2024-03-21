<template>
    <div class="home">
        <h1>Kezdőoldal</h1>
        <p>Session Timeout: {{ formattedTime }}</p>
        <p>Bejelentkezve mint: {{ username }} </p>
        <p> Account ID: {{ accountId }}</p>
        <p>IP cím: {{ clientIp }}</p>
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
            timer: null,
            sessionId: '',
            username: '',
            accountId: '',
            clientIp: '',
        }
    },
    name: 'Home',
    methods: {
        async logout() {
            await axios.post('http://192.168.0.133:4000/logout', {}, {
                headers: {
                    'X-Session-Id': this.sessionId //sessionId felküldése
                },
                withCredentials: true
            }).then((response) => {
                console.log(response.status, response.data);   
                localStorage.setItem('sessionTimeout', 0);
                this.$router.push('/').catch((e) => { console.log(e) });
            }).catch((error) => {
                console.error('Hiba történt a kijelentkezés során:', error.response.data);
            });
        },
        async getSessionTimeout() {
            this.sessionTimeout = parseInt(localStorage.getItem('sessionTimeout'));
            this.timer = setInterval(this.countdown, 1000); //countdown inditasa
        },
        countdown() {
            if(this.sessionTimeout > 0) {
                this.sessionTimeout--;
                const perc = Math.floor(this.sessionTimeout / 60);
                const masodperc = this.sessionTimeout % 60;
                this.formattedTime = `${perc}:${masodperc < 10 ? '0' : ''}${masodperc}`;
            } else {
                clearInterval(this.timer); //idozito leallitasa
                console.log('Session Timeout!');
                this.logout();
            }
        },
        async checkLoginStatus() {
            try { //sessionId cookie kiolvasása
                this.sessionId = document.cookie.split('; ').find(row => row.startsWith('sessionId=')).split('=')[1];
            } catch (e) { this.sessionId = ''; }
                
            if (this.sessionId) {
                try {
                    const response = await axios.get('http://192.168.0.133:4000/checkLogin', {
                        headers: {
                        'x-session-id': this.sessionId,
                        },
                        withCredentials: true
                    });
                    if (response.status === 200) {
                        console.log('resp data:', response.data);
                        console.log('Bejelentkezve mint:', response.data.username);
                        this.username = response.data.username;
                        this.accountId = response.data.account;
                        this.clientIp = response.data.ip;
                    } else {
                        this.logout();
                        console.log(res.status, res.data, 'Kijelentkeztél!');
                    }
                } catch (error) {
                    console.error(error.response.data);
                }
            } else {
                console.log('Nincs bejelentkezve!');
                localStorage.setItem('sessionTimeout', 0);
                return this.$router.push('/').catch((e) => { console.log(e) });
            }
        }
    },    
    created() {
        this.checkLoginStatus();
        if(this.sessionId) this.getSessionTimeout();
    },
}
</script>

<style src="./home.css"></style>
