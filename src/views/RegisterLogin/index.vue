<template>
  <div class="regist-login">
    <img src="@/assets/img/logo_alt@2x.png" />
    <form class="form-data" @submit.prevent="login()">
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
      <p class="errmsg">{{ errorMessage }}</p>
      <div class="buttons">
        <input type="submit" v-if="$route.path =='/signup'" @click="signup()" value="Sign Up" />
        <input type="submit" v-if="$route.path =='/login'" @click="login()" value="Log In" />
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
      checked: false,
      errorMessage: '',
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
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
            console.log(error);
            this.errorMessage = 'Failed to Register';
          },
        );
      }
    },
    async login() {
      if (this.formData.email.length > 0 && this.formData.password.length > 0) {
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
            console.log(error);
            this.errorMessage = 'Failed to login';
          },
        );
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
