<template>
    <div class="home">
        <h1>Welcome to Home Page</h1>
    </div>
</template>

<script>
import login from '@/components/Login';

export default {
    name: 'Home',
    data() {
        console.log(localStorage);
        return {
            message: 'Welcome to Home Page',
            
        }
    },
    created() {
        login.methods.checkLoginStatus();
    },
}
</script>

<style src="./home.css"></style>