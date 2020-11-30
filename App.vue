<template>
  <div>
    <!-- Home 버튼 공통부분 -->
    <router-link
      to="/"
      class="to-home">
      <i class="material-icons">home</i>
    </router-link>

    <router-view />
  </div>
</template>

<script>
export default {
  created () {
    // router 객체에 대한 내용 담고 있다.(페이지 이동, push 등)
    console.log('Router:', this.$router)
    // route는 현재 페이지 url에 대한 정보를 담고 있다. (query, param 등)
    console.log('Route:', this.$route)
  }
}
</script>

<style lang="scss">
  .to-home.router-link-exact-active {
    display: none;
  }
</style>
