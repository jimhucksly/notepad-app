<template>
  <div id="auth_cont">
    <div class="auth_cont">
      <form class="form-auth">
        <div class="title">Sign In</div>
        <div class="form-group">
          <div class="form-group-inner">
            <label
              :class="{
                active: login.length > 0,
                error: !!errors.login
              }">Login:</label>
            <input type="text" placeholder="Login"
              :class="{ error: !!errors.login }"
              v-model="login"
              @keyup.enter.prevent="submit">
          </div>
          <div>
            <span class="form-label-error" v-show="!!errors.login && !!login.length">Login is incorrect</span>
          </div>
        </div>
        <div class="form-group">
          <div class="form-group-inner">
            <label
              :class="{
                active: pass.length > 0,
                error: !!errors.pass
                }">Password:</label>
            <input type="password" placeholder="Password"
              :class="{ error: !!errors.pass }"
              v-model="pass"
              @keyup.enter.prevent="submit">
          </div>
          <div>
            <span class="form-label-error" v-show="!!errors.pass && !!pass.length">Password is incorrect</span>
          </div>
        </div>
        <div>
          <button class="btn btn-primary" @click.prevent="submit">Go!</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script src="./auth.ts" lang="ts"></script>
