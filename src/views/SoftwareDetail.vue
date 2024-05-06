<template>
    <Toast position="top-left" />
    <div class="grid">
        <div class="col-12 text-center">
            <img :src="'/' + softwareInfo.bucket + '/' + softwareInfo.imgPath" :alt="softwareInfo.imgPath"
                class="block m-auto">
            <h1>{{ softwareInfo.name }}</h1>
        </div>
        <div class="col-12">
            <div class="flex align-items-center justify-content-center">
                <div class="flex align-items-center">
                    <div class="p-3">
                        软件大小：{{ softwareInfo.size }}
                    </div>
                    <div class="p-3">
                        更新日期：{{ softwareInfo.time }}
                    </div>
                </div>
                <Button @click="DownloadMed" label="立即下载" severity="help" class="p-button-help" />
            </div>
        </div>
    </div>
    <div class="card">
        <p v-html="softwareInfo.content" class="text-center"></p>
    </div>
</template>

<script>
import { SoftwareStore } from '@/stores/software'
export default {
    name: "Detail",
    data() {
        return {
            softwareInfo: {
                name: '',
                bucket: '',
                imgPath: '',
                info: '',
                content: '',
                time: '',
                size: ''
            },
            id: ''
        };
    },
    methods: {
        // 进入详情页面后回到顶部
        backTop() {
            window.scrollTo(0, 0);
        },
        async DownloadMed() {
            const useSoftwareStore = SoftwareStore()
            const res = await useSoftwareStore.softwareDownload({ ID: this.id })
            if (res.data.code != 200) {
                console.log("softwareDownload err", res);
                this.$toast.add({ severity: 'error', summary: res.data.msg, life: 3000 })
                throw new Error(res)
            }
            const bucketName = res.data.data.bucket
            const filePath = res.data.data.downloadPath
            window.location.href = `/${bucketName}/${filePath}`
        },

    },
    created() {
        const useSoftwareStore = SoftwareStore()
        this.id = this.$route.query.id || 1
        console.log("query id", this.$route.query.id);
        this.backTop()


        useSoftwareStore.softwareDetail({ ID: this.id })
            .then(res => {
                console.log("software detail", res);
                this.softwareInfo.name = res.data.data.name
                this.softwareInfo.imgPath = res.data.data.imgPath
                this.softwareInfo.bucket = res.data.data.bucket
                this.softwareInfo.info = res.data.data.info
                this.softwareInfo.content = res.data.data.content
                this.softwareInfo.time = res.data.data.time
                this.softwareInfo.size = res.data.data.size
            })
            .catch(err => {
                console.log("softwareDetail 90 err", err);
                this.$toast.add({ severity: 'error', summary: err.data.msg, life: 3000 })
            })
    }
};
</script>
