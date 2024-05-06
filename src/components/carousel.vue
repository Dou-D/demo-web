<template>
    <div class="card w-full text-center">
        <Toast position="top-left" />
        <Carousel :value="products" :numVisible="5" :numScroll="2" circular :autoplayInterval="3000">
            <template #item="slotProps">
                <div class="border-1 surface-border border-round m-2" style="height: 280.8px;">
                    <router-link :to="{ path: '/detail', query: { id: slotProps.data.ID } }">
                        <div class="mb-3">
                            <div class="relative text-center">
                                <img :src="'/' + slotProps.data.BucketName + '/' + slotProps.data.ImagePath"
                                    :alt="slotProps.data.ImagePath"
                                    class="border-round" style="object-fit: contain;height: 280px;" />
                            </div>
                        </div>
                    </router-link>
                </div>
            </template>
        </Carousel>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import { SoftwareStore } from '@/stores/software'
export default {
    data() {
        return {
            products: [],
        };
    },
    created() {
        this.InitSoftwareList()
    },
    methods: {
        async InitSoftwareList() {
            const useSoftwareStore = SoftwareStore();
            // 轮播图->获取list的前5个软件
            if (!useSoftwareStore.isLoaded) {
                await useSoftwareStore.softwareList();
            }
            this.products = useSoftwareStore.SoftwareArrays.slice(0, 8);
            console.log("this.products", this.products);
        }
    },
};
</script>

<style scoped>
.router-link-active {
    text-decoration: none;
}

a {
    text-decoration: none;
}
</style>