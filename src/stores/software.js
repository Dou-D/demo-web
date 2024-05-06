import { defineStore } from "pinia";
import softwareService from "@/service/software";

export const SoftwareStore = defineStore("software", {
    state: () => {
        return {
            SoftwareArrays: [],
            isLoaded: false,
            IDE: [],
            Info: [],
            elect: []
        }
    },
    actions: {
        async softwareList() {
            const res = await softwareService.softwareList()
            this.SoftwareArrays = res.data.data.list

            this.isLoaded = true;
        },
        // 上传软件及其信息
        softwareAdd({ name, info, content, img, apk }) {
            this.isLoaded = false
            return softwareService.softwareAdd({ name, info, content, img, apk })
        },
        // 下载软件
        softwareDownload({ ID }) {
            return softwareService.softwareDownload({ ID })
        },
        // 软件详情
        softwareDetail({ ID }) {
            return softwareService.softwareDetail({ ID })
        },
        softwareEdit({ name, info, content, id }) {
            this.isLoaded = false
            return softwareService.softwareEdit({ name, info, content, id })
        },
        softwareDel({ ID }) {
            this.isLoaded = false
            return softwareService.softwareDel({ ID })
        },
        softwareGetList(content) {
            return softwareService.searchGetList(content)
        },
        softwareFindName({ Name }) {
            return softwareService.softwareFindName({ Name })
        },
    }
});