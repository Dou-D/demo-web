<template>
    <div class="card">
        <Menubar :model="items" style="background-color: #fff;">
            <template #start>
                <div class="inline-flex">
                    <div
                        class="hidden md:block align-items-center justify-content-center border-round">
                        <div class="text-center p-3 border-round-sm">
                            <router-link to="/home">
                                <Image src="/qing/img/MetcLogo.png" alt="Logo" width="250" />
                            </router-link>
                        </div>
                    </div>
                </div>
            </template>

            <template #item="{ item, props, hasSubmenu, root }">
                <a v-ripple class="flex align-items-center" v-bind="props.action">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                    <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
                    <span v-if="item.shortcut"
                        class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{{ item.shortcut
                        }}</span>
                    <i v-if="hasSubmenu"
                        :class="['pi pi-angle-down', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]"></i>
                </a>

            </template>
            <!-- 右边input -->

            <template #end>
                <div class="flex align-items-center gap-2">
                    <div
                        class="flex-shrink-1 md:flex-shrink-0 flex align-items-center justify-content-center font-bold my-3 border-round">
                        <InputText v-model="targetSoftware" @keyup.enter="handleSearchDown" placeholder="Enter"
                            type="text" />
                    </div>
                    <Avatar shape="circle" class="pi pi-user" style="text-align: center;line-height: 32px;"
                        @click="admin" />
                </div>
            </template>
        </Menubar>
    </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { SoftwareStore } from '@/stores/software.js'
import EventBus from "@/util/EventBus";
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const router = useRouter()
const items = ref([
    {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => {
            router.replace("/home")
            EventBus.emit("updateHomeView")
        }
    },
    {
        label: 'Console',
        icon: 'pi-user-plus',
        command: () => {
            if (router.currentRoute.value != console) router.push("/console")
        }
    },
]);
function admin() {
    router.replace("/admin")
}
// 搜索过滤
const useSoftwareStore = SoftwareStore()
// 防止pinia数据未初始化
async function getSoftwareList() {
    if (!useSoftwareStore.isLoaded) {
        await useSoftwareStore.softwareList()
    }
}
getSoftwareList()

/**
 * @targetSoftware 搜索目标
 * @handleSearchDown 搜索操作
 */
const targetSoftware = ref('');
async function handleSearchDown() {
    const useSoftwareStore = SoftwareStore()
    const res = await useSoftwareStore.softwareGetList(targetSoftware.value)
    if (res.data.code != 200) {
        toast.add({ severity: 'error', summary: err.data.msg, life: 3000 })
        return
    }
    if (!res.data.data.result) {
        toast.add({ severity: 'warn', summary: `没有找到${targetSoftware.value}`, life: 3000 });
        // 输入框为空时刷新list
        EventBus.emit("InputUpdateList")
        return
    }
    const findNameList = await Promise.all(res.data.data.result.map(async (item) => {
        const findNameRes = await useSoftwareStore.softwareFindName({ Name: item });
        return findNameRes.data.data;
    }));
    EventBus.emit("findNameEvent", findNameList)
}
onUnmounted(() => {
    EventBus.off("updateHomeView")
})
</script>

<style scoped>
.router-link-active {
    text-decoration: none;
}

a {
    text-decoration: none;
}
</style>
