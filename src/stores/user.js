import {defineStore} from "pinia";
import storage from "@/service/storage.js";
import userService from "@/service/user.js";

export const UserStore = defineStore("user", {
    state: () => {
        return {};
    },
    actions: {
        SET_TOKEN(token) {
            storage.set(storage.USER_TOKEN, token);
        },
        SET_USERINFO(userInfo) {
            storage.set(storage.USER_INFO, JSON.stringify(userInfo));
        },
        // 开始注册 get
        async BeginRegister(name) {
            return userService.beginRegister(name)
        },
        // 完成注册 post
        async FinishRegister(params) {
            const res = await userService.finishRegister(params)
            if (res.data.code == 200)
                this.SET_TOKEN(res.data.data.token);
            return res
        },
        // 开始登录 get
        async BeginLogin(name) {
            return await userService.beginLogin(name)
        },
        // 完成登录 post
        async FinishLogin(params) {
            const res = await userService.finishLogin(params)
            if (res.data.code == 200)
                this.SET_TOKEN(res.data.data.token);
            return res
        },
    },
});

