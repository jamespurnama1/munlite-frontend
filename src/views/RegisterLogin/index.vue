<template>
  <div class="regist-login">
    <img src="@/assets/img/logo_alt@2x.png" />
    <div class="form-data">
      <input
        type="text"
        v-if="$route.path != '/login' && $route.path !='signup'"
        v-model="formData.first"
        placeholder="First Name"
        required
      />
      <input
        type="text"
        v-if="$route.path != '/login' && $route.path !='signup'"
        v-model="formData.last"
        placeholder="Last Name"
        required
      />
      <input
        type="email"
        v-model="formData.email"
        placeholder="E-mail"
        required
      />
      <input type="password" v-model="formData.password" placeholder="Password" required/>
      <input
        type="password"
        v-if="$route.path != '/login' && $route.path !='signup'"
        v-model="formData.confirm"
        placeholder="Confirm Password"
        required
      />
      <div class="remember">
        <input type="checkbox" v-model="checked" class="checked">
        <label for="checkbox">Remember Me</label>
      </div>
      <p class="errmsg">{{ errorMessage }}</p>
      <div class="buttons">
        <button v-if="$route.path =='/signup'" @click="signup()">Sign Up</button>
        <button v-if="$route.path =='/login'" @click="login()">Log in</button>
      </div>
    </div>
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
      checked: false,
      errorMessage: '',
    };
  },
  methods: {
    signup() {
      if (this.formData.password !== this.formData.confirm) {
        this.errorMessage = 'Confirmed password does not match';

        Object.values(this.formData).forEach((item) => {
          if (item.length < 1) {
            this.errorMessage = 'Fill all required fields';
            console.log(item);
          }
        });
      } else {
        this.$router.push('/home'); // change to api request later
      }
    },
    login() {
      if (this.formData.email.length > 0 && this.formData.password.length > 0) {
        this.$router.push('/home'); // change to api request later
      } else {
        this.errorMessage = 'Fill all required fields';
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
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
