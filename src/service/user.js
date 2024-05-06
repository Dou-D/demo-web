import request from "@/util/request";
// 用户注册
// 开始注册
const beginRegister = (name) =>
  request.get("/auditor/beginRegister", { params: { name } });

// 完成注册
const finishRegister = (startRegistrationRes) =>
  request.post("/auditor/finishRegister", startRegistrationRes);

// 用户登录
const beginLogin = (name) =>
  request.get("/auditor/beginLogin", { params: { name } });

// 完成登录
const finishLogin = (startAuthenticationRes) =>
  request.post("/auditor/finishLogin", startAuthenticationRes);


export default {
  beginRegister,
  finishRegister,
  beginLogin,
  finishLogin,
};
