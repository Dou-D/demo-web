<template>
    <keep-alive>
        <RouterView />
    </keep-alive>
</template>

<script>
import { RouterView } from 'vue-router';
export default {
    components: {
        RouterView
    }
}
</script>