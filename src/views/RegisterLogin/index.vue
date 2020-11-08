<template>
  <div class="regist-login">
    <img src="@/assets/img/logo_alt@2x.png" />
    <form class="form-data">
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
        type="text"
        v-model="formData.username"
        :placeholder="placeholder"
        required
      />
      <input
        type="email"
        v-if="$route.path != '/login' && $route.path !='signup'"
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
      <div class="buttons">
        <button type="submit" v-if="$route.path =='/signup'" @click="signup()">Sign Up</button>
        <button type="submit" v-if="$route.path =='/login'" @click="login()">Log in</button>
      </div>
    </form>
    <div class="footer">
      <p v-if="$route.path == '/login'">
        Don't have an account? <a @click="$router.push('/signup')">Sign Up</a>
      </p>
      <p v-if="$route.path == '/signup'">
        Already have an account? <a @click="$router.push('/login')">Log In</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  Name: 'RegisterLogin',
  data() {
    return {
      formData: {
        first: '',
        last: '',
        username: '',
        email: '',
        password: '',
        confirm: '',
      },
      checked: false,
    };
  },
  methods: {
    signup() {
      let filled = true;
      this.formData.forEach((item) => {
        if (item === '') {
          filled = false;
        }
      });

      console.log(filled);
    },
    login() {
      let filled = true;
      if (this.formData.username.length > 0) {
        filled = true;
        console.log(filled);
      }
    },
  },
  computed: {
    placeholder() {
      return this.$route.path === 'login' ? 'Username or E-mail' : 'Username';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import './index.scss';
</style>
