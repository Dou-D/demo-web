<template>
    <TabView class="w-full flex flex-wrap flex-column justify-content-center gap-3">
        <TabPanel header="IDE" class="w-full text-center">
            <div class="grid justify-content-center w-full text-center">
                <div v-for="item in IDEList" :key="item.ID"
                    class="sm:col-12 md:col-6 lg:col-3 xl:col-3 text-center border-round-sm">
                    <SoftwareCard :id="item?.ID"></SoftwareCard>
                </div>
            </div>
        </TabPanel>
        <TabPanel header="信息" class="w-full text-center">
            <div class="grid justify-content-center w-full text-center">
                <div v-for="item in InfoList" :key="item.ID"
                    class="sm:col-12 md:col-6 lg:col-3 xl:col-3 text-center border-round-sm">
                    <SoftwareCard :id="item?.ID"></SoftwareCard>
                </div>
            </div>
        </TabPanel>
        <TabPanel header="电气" class="w-full text-center">
            <div class="grid justify-content-center w-full text-center">
                <div v-for="item in ElectList" :key="item.ID"
                    class="sm:col-12 md:col-6 lg:col-3 xl:col-3 text-center border-round-sm">
                    <SoftwareCard :id="item?.ID"></SoftwareCard>
                </div>
            </div>
        </TabPanel>
    </TabView>
</template>

<script setup>
import SoftwareCard from '@/components/softwarecard.vue';
const props = defineProps(['IDEList', 'InfoList', 'ElectList'])
</script>