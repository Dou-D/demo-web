<template>
    <Menubar />
    <keep-alive>
        <RouterView />
    </keep-alive>
</template>

<script setup>
import Menubar from '@/components/menubar.vue'
import { RouterView } from 'vue-router';
</script>