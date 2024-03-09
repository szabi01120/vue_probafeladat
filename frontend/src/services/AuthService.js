import axios from "axios";

class AuthService {
  isLoggedIn() {
    return localStorage.getItem('token') === 'true';
  }

  async login(loginForm) {
    try {
      const response = await axios.post('http://localhost:4000/login', loginForm);
      const token = response.data.token;
      localStorage.setItem('token', token);
      return true;
    } catch (error) {
      console.error('Hiba történt a bejelentkezés során:', error);
      return false;
    }
  }

  logout() {
    localStorage.removeItem('token');
  }

  checkAuth() {
    return this.isLoggedIn();
  }
}

export default new AuthService();
