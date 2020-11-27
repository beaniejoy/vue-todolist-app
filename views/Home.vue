<template>
    <section class="home">
        <div>
            <h1>BeanieJoy's Home Page</h1>
            <!-- 이렇게 직접 $router를 사용 가능 -->
            <h2 @click="$router.push('/about')">
                About
            </h2>
            <h2 @click="$router.push('/todos')">
                Todo App
            </h2>
            <!-- 이렇게도 표현가능 (글자표시가 다르게 나옴)
                tag를 붙여 style통일 가능 -->
            <router-link
                to="/todos"
                tag="h2">
                Todo App
            </router-link>
        </div>
    </section>
</template>

<script>
export default {
  methods: {
    // toAbout () {
    //     // vue-router가 있으면 $router 사용가능
    //     // page 이동
    //     this.$router.push('/about')
    // },
    // toTodoApp () {
    //     this.$router.push('/todos')
    // }
  }
}
</script>
