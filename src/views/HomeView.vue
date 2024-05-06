<template>
  <Toast position="top-left" />
  <!-- 轮播图 -->
  <div class="text-center py-3 font-bold my-1vh">
    <Carousel class="w-full text-center" />
  </div>
  <!-- 主页的软件列表 -->
  <div class="flex justify-content-center flex-wrap w-full text-center">
    <!-- 调下载接口传递id -->
    <TagView :IDEList="IDEList" :InfoList="InfoList" :ElectList="ElectList" class="w-full text-center" />
  </div>
  <!-- 联系我们 -->
  <div class="grid w-full">
    <div class="text-center py-3 bg-blue-400 font-bold w-full">
        <div>联系我们</div>
        <span class="col-4">
          地址： 综合楼B-303
        </span>
        <span class="col-4">
          邮箱： xxxxx
        </span>
      </div>
  </div>
</template>

<script>
import { nextTick } from 'vue'
import Carousel from '@/components/carousel.vue'
import SoftwareCard from '@/components/softwarecard.vue'
import { SoftwareStore } from "@/stores/software"
import EventBus from '@/util/EventBus'
import TagView from '@/components/tagview.vue'
export default {
  data() {
    return {
      softwareList: [],
      IDEList: [],
      InfoList: [],
      ElectList: []
    }
  },
  components: { Carousel, SoftwareCard, TagView },
  methods: {
    // 防止pinia未初始化
    async InitSoftwareList() {
      const useSoftwareStore = SoftwareStore()
      if (!useSoftwareStore.isLoaded) {
        await useSoftwareStore.softwareList();
      }
      this.softwareList = useSoftwareStore.SoftwareArrays
      for (const item of this.softwareList) {
        if (item.Info === 'IDE') this.IDEList.push(item)
        else if (item.Info === '信息') this.InfoList.push(item)
        else if (item.Info === '电气') this.ElectList.push(item)
      }
    }
  },
  created() {
    this.InitSoftwareList()
    // mitt 监听事件
    EventBus.on('findNameEvent', async (data) => {
      this.IDEList = [], this.ElectList = [], this.InfoList = []
      for (const item of data) {
        if (item.Info === 'IDE') this.IDEList.push(item)
        else if (item.Info === '信息') this.InfoList.push(item)
        else if (item.Info === '电气') this.ElectList.push(item)
      }
      await nextTick()
      console.log(data, 'eventBus data');
    });
    // 刷新页面
    EventBus.on('updateHomeView', async () => {
      this.InitSoftwareList()
    });
    EventBus.on('InputUpdateList', async () => {
      this.InitSoftwareList()
    });
  },
  unmounted() {
    EventBus.off('updateHomeView');
    EventBus.off('findNameEvent');
    EventBus.off('InputUpdateList');
  }

}
</script>
