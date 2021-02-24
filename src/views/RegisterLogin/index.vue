<template>
  <div class="regist-login">
    <img src="@/assets/img/logo_alt@2x.png" />
    <form class="form-data" @submit.prevent="formSubmission()">
      <div class="input" v-if="$route.path != '/login' && $route.path !='signup'">
      <input
        v-model="formData.first"
        type="text"
        :data-value="formData.first ? formData.first : ''"
        placeholder=" "
        autocomplete="given-name"
        required>
      <label>First Name</label>
    </div>
    <div class="input" v-if="$route.path != '/login' && $route.path !='signup'">
      <input
        v-model="formData.last"
        type="text"
        :data-value="formData.last ? formData.last : ''"
        placeholder=" "
        autocomplete="family-name"
        required>
      <label>Last Name</label>
    </div>
    <div class="input">
      <input
        v-model="formData.email"
        type="email"
        :data-value="formData.email ? formData.email : ''"
        placeholder=" "
        autocomplete="email"
        required>
      <label>E-mail</label>
    </div>
    <div class="input">
      <input
        v-model="formData.password"
        type="password"
        placeholder=" "
        :autocomplete="pass"
        required>
      <label>Password</label>
    </div>
    <div class="input" v-if="$route.path != '/login' && $route.path !='signup'">
      <input
        v-model="formData.confirm"
        type="password"
        placeholder=" "
        autocomplete="new-password"
        required>
      <label>Confirm Password</label>
    </div>
      <p class="errmsg">{{ errorMessage }}</p>
      <div class="buttons">
        <input type="submit" v-if="$route.path =='/signup'" @click="signup()"
          :value="signupButton" />
        <input type="submit" v-if="$route.path =='/login'" @click="login()" :value="loginButton" />
      </div>
    </form>
    <div class="footer">
      <p v-if="$route.path == '/login'">
        Don't have an account? <a @click="changeRoute()">Sign Up</a>
      </p>
      <p v-if="$route.path == '/signup'">
        Already have an account? <a @click="changeRoute()">Log In</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterLogin',
  data() {
    return {
      formData: {
        first: '',
        last: '',
        email: '',
        password: '',
        confirm: '',
      },
      errorMessage: '',
      signupButton: 'Sign Up',
      loginButton: 'Log In',
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    },
    pass() {
      let p;
      switch (this.$route.path) {
        case '/login':
          p = 'current-password';
          break;
        case '/signup':
          p = 'new-password';
          break;
        default:
          p = '';
      }
      return p;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/');
    }
  },
  methods: {
    async signup() {
      if (this.formData.password !== this.formData.confirm) {
        this.errorMessage = 'Confirmed password does not match';

        Object.values(this.formData).forEach((item) => {
          if (item.length < 1) {
            this.errorMessage = 'Fill all required fields';
          }
        });
        const checkEmail = this.validateEmail(this.formData.email);
        if (checkEmail !== true) {
          this.errorMessage = 'E-mail is not valid';
        }
      } else {
        this.signupButton = 'Signing up...';
        const user = {
          first_name: this.formData.first,
          last_name: this.formData.last,
          email: this.formData.email,
          password: this.formData.password,
        };
        this.$store.dispatch('register', user).then(
          () => {
            this.$router.push('/login');
          },
          (error) => {
            console.error(error);
            this.signupButton = 'Sign Up';
            this.errorMessage = 'Failed to Register';
          },
        );
      }
    },
    async login() {
      if (this.formData.email.length > 0 && this.formData.password.length > 0) {
        this.loginButton = 'Logging in...';
        const user = {
          email: this.formData.email,
          password: this.formData.password,
        };
        this.$store.dispatch('login', user).then(
          () => {
            if (this.$route.query.from) {
              this.$router.push(this.$route.query.from);
            } else {
              this.$router.push('/');
            }
          },
          (error) => {
            this.loginButton = 'Log In';
            const errResponse = error.response.data.error.message;
            this.errorMessage = `Failed to login. ${errResponse.charAt(0).toUpperCase() + errResponse.slice(1)}.`;
          },
        );
      } else {
        this.errorMessage = 'Fill all required fields';
      }
    },
    formSubmission() {
      if (this.$route.path === '/signup') {
        this.signup();
      } else {
        this.login();
      }
    },
    changeRoute() {
      this.errorMessage = '';
      Object.keys(this.formData).forEach((item) => {
        this.formData[item] = '';
      });

      if (this.$route.path === '/login') {
        this.$router.push('/signup');
      } else {
        this.$router.push('/login');
      }
    },
    validateEmail(email) {
      const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]+)*$/;
      if (mailformat.test(email)) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
