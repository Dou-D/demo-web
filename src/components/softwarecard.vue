<template>
  <Toast position="top-left" />
  <Card class="overflow-hidden" style="width: 256px;height: 443px;">
    <template #header class="text-center">
      <img :src="softwareInfo.bucket + '/' + softwareInfo.imgPath" :alt="softwareInfo.imgPath"
        style="height: 240px;object-fit: contain;" />
    </template>

    <template #title>{{ softwareInfo.name }}</template>

    <template #subtitle>{{ softwareInfo.info }}</template>

    <template #footer>
      <div class="flex gap-3 justify-content-center">
        <Button label="下载" @click="DownloadMed" severity="secondary" outlined />
        <router-link :to="{ path: '/detail', query: { 'id': id } }" rel="noopener">
          <Button label="详情" />
        </router-link>
      </div>
    </template>
  </Card>
</template>

<script>
import { RouterLink } from 'vue-router';
import { SoftwareStore } from '@/stores/software';

export default {
  props: ["id"],
  data() {
    return {
      softwareInfo: '',
    }
  },
  methods: {
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
    async getSoftwareDetails() {
      const useSoftwareStore = SoftwareStore()
      const res = await useSoftwareStore.softwareDetail({ ID: this.id })
      if (res.data.code != 200) {
        this.$toast.add({ severity: 'error', summary: res.data.msg, life: 3000 })
        throw new Error(res)
      }
      this.softwareInfo = res.data.data
    }

  },
  created() {
    this.getSoftwareDetails()
  },
}
</script>

<style scoped>
.router-link-active {
  text-decoration: none;
}

a {
  text-decoration: none;
}
</style>