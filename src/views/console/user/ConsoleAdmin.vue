<template>
  <!-- 管理员登录注册 -->
  <Toast position="top-right" />
  <div class="card flex flex-wrap justify-content-center gap-3 w-full md:w-auto">
    <div class="flex flex-column">
      <div class="flex align-items-center justify-content-center h-4rem font-bold border-round m-2">
        <span class="p-input-icon-left">
          <i class="pi pi-user" />
          <InputText v-model="name" placeholder="example_username" />
        </span>
      </div>
      <div class="flex align-items-center justify-content-center h-4rem font-bold border-round m-2">
        <div class="flex align-items-center justify-content-center w-8rem h-4rem font-bold border-round m-2">
          <Button label="Register" @click="register" />
        </div>
        <div class="flex align-items-center justify-content-center w-8rem h-4rem font-bold border-round m-2">
          <Button label="Login" @click="login" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { UserStore } from '@/stores/user'
export default {
  data() {
    return {
      // 用户名
      name: '',
    }
  },
  methods: {
    async register() {
      const useUserStore = UserStore()
      const name = this.name
      // 用户名不能为空
      if (name.trim() === "") return
      // start register
      let res = await useUserStore.BeginRegister(name)
      if (res.data.code != 200) {
        console.log("begin register err", res);
        this.$toast.add({ severity: 'error', summary: res.data.msg, life: 3000 })
        return
      }
      console.log("BeginRegister ✌️✌️", res);
      // webauthn认证参数
      const challengeid = res.data.data.challengeid
      const userid = res.data.data.userid
      const json_data = {
        challenge: challengeid,
        rp: {
          id: "webauthn.sylu.site",
          name: "rp name"
        },
        user: {
          id: userid,
          name: name,
          displayName: "displayName"
        },
        pubKeyCredParams: [
          {
            type: "public-key",
            alg: -7,
          }
        ],
        authenticatorSelection: {
          authenticatorAttachment: "cross-platform",
          userVerification: "discouraged",
          requireResidentKey: false
        },
        timeout: 60000,
        attestation: "direct",
      }
      console.log("register json_data", json_data);
      // start signture
      const startRegistrationRes = await startRegistration(json_data)
      // finish register
      console.log("startRegistrationRes", startRegistrationRes);
      const FinishRegisterRes = await useUserStore.FinishRegister(startRegistrationRes)
      console.log("FinishRegisterRes", FinishRegisterRes);
      if (FinishRegisterRes.data.code != 200) {
        console.log("FinishRegister err", FinishRegisterRes);
        this.$toast.add({ severity: 'error', summary: FinishRegisterRes.data.msg, life: 3000 })
        return
      }
      console.log("FinishRegisterRes ✌️✌️", FinishRegisterRes);
      // success register msg
      this.$toast.add({
        severity: 'success',
        summary: FinishRegisterRes.data.msg,
        detail: FinishRegisterRes.data.data,
        life: 3000
      })
      this.$router.replace({ path: "/console" })
    },
    async login() {
      const name = this.name
      // 用户名不能为空
      if (name.trim() === "") return
      const useUserStore = UserStore()
      // start login
      const res = await useUserStore.BeginLogin(name)
      if (res.data.code != 200) {
        console.log("BeginLogin err", res);
        this.$toast.add({ severity: 'error', summary: res.data.msg, life: 3000 })
        return
      }
      console.log("BeginLogin ✌️✌️ res", res);
      // webauthn认证参数
      const ars = res.data.data.allowCredentials
      const challenge = res.data.data.challenge
      const json_data = {
        challenge: challenge,
        timeout: 60000,
        rpId: "webauthn.sylu.site",
        allowCredentials: ars,
        userVerification: "discouraged",
        extensions: {},
      }
      console.log("login json_data", json_data);
      // start login authn
      const startAuthenticationRes = await startAuthentication(json_data)
      console.log("startAuthenticationRes", startAuthenticationRes)
      // finish login
      const FinishLoginRes = await useUserStore.FinishLogin(startAuthenticationRes)
      console.log("FinishLoginRes✌️✌️", FinishLoginRes);
      if (FinishLoginRes.data.code != 200) {
        console.log("FinishLoginRes err", FinishLoginRes);
        this.$toast.add({ severity: 'error', summary: FinishLoginRes.data.msg, life: 3000 })
        return
      }
      // success login msg
      this.$toast.add({
        severity: 'success',
        summary: FinishLoginRes.data.msg,
        detail: FinishLoginRes.data.data,
        life: 3000
      })
      // 登录成功 跳转控制台
      this.$router.replace({ path: "/console" })
    },
  }
}
</script>