import request from "@/util/request";
// 获取文件列表
const softwareList = () => request.get("/software/findSoftwareList");
// 软件上传
const softwareAdd = ({ name, info, content, img, apk }) =>
    request.post("/software/createSoftware",
        { name, info, content, img, apk },
        {
            headers: { "Content-Type": "multipart/form-data" }
        });
// 软件下载
const softwareDownload = ({ ID }) =>
    request.post(
        "/software/downloadSoftware",
        { ID },
        {
            headers: { "Content-Type": "multipart/form-data" }
        });
// 查询单个软件详情
const softwareDetail = ({ ID }) =>
    request.post(
        "/software/findDetailedSoftware",
        { ID: String(ID) },
        { headers: { 'Content-Type': 'application/json' } }
    );
// 编辑对应id软件
const softwareEdit = ({ name, info, content, id }) =>
    request.post("/software/editSoftware",
        {
            name, info, content, id: JSON.stringify(id)
        },
        {
            headers: { "Content-Type": "multipart/form-data" }
        }
    );
const softwareDel = ({ ID }) =>
    request.post(
        "/software/deleteSoftware",
        { ID: JSON.stringify(ID) },
        {
            headers: { "Content-Type": "multipart/form-data" }
        }
    )

const searchGetList = (content) =>
    request.get(
        `/search?content=${content}`,
    )

const softwareFindName = ({ Name }) =>
    request.post(
        "/software/findDetailedSoftwareByName",
        { Name },
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
export default {
    softwareList,
    softwareAdd,
    softwareDownload,
    softwareDetail,
    softwareEdit,
    softwareDel,
    searchGetList,
    softwareFindName
};
