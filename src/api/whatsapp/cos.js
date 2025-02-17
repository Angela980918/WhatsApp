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

/**
 * 上傳素材
 */
export const uploadMaterial = (file, category, userId) => {
    const materialFile = new FormData();
    materialFile.append("file", file);
    materialFile.append("fileCategory", category)
    materialFile.append("userId", userId)
    return whatsappInstance({
        url: '/materials/upload-material', method: 'post', data: materialFile,
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
}

/**
 * 删除素材文件
 */
export const deleteMaterial = (data) => {
    return whatsappInstance({
        url: '/materials/delete-materials', method: 'DELETE', data: data,
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
}

/**
 * 查询素材资料
 */
export const libraryFiles = (data) => {
    return whatsappInstance({
        url: `/materials/library-files?${data}`, method: 'GET'
    })
}

/**
 * 查詢快捷用語
 */
export const loadQuickList = () => {
    return whatsappInstance({
        url: `/materials/find-quick-reply?userId=449711484896804&userId=67890&userType=user`, method: 'GET'
    })
}

/**
 * 上传快捷用语
 */
export const uploadQuickMsg = (data) => {
    return whatsappInstance({
        url: `/materials/upload-quick-reply`, method: 'POST', data: data
    })
}

/**
 * 上傳临时文件
 */
export const uploadTempFile = (file, category, userId) => {
    const materialFile = new FormData();
    materialFile.append("file", file);
    materialFile.append("fileCategory", category)
    materialFile.append("userId", userId)
    return whatsappInstance({
        url: '/materials/upload-temp-material', method: 'post', data: materialFile,
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
}


