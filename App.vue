<template>
    <h1>{{ msg }}</h1>
</template>

<script>
export default {
    data () {
         return {
             msg: 'Hello Joybeanie GOGO!'
         }
    }
}
</script>

<style lang="scss" scoped>
$color: gray;
h1 {
    color: $color;
    display: flex;
}
</style>