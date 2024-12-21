import {whatsappInstance} from "@/api/http.js";

/**
 * 上傳文件
 */
export const uploadFile = (file) => {
    const uploadData =  new FormData
    uploadData.append('file', file)
    return whatsappInstance({
        url: '/cos/upload', method: 'post', data: uploadData,
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
}
