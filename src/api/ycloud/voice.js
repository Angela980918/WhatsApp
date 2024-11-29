import {ycloudInstance} from "@/api/http.js";

/**
 * 發語音驗證碼
 * @param to 收件人電話
 * @param verificationCode 驗證碼
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const sendVoiceCode = (to, verificationCode) => {
    return ycloudInstance({
        url: '/voices', method: 'post', data: {
            to, verificationCode
        }
    })
}

/**
 * 查看語音驗證列表
 * @param page 頁數，默認為1
 * @param limit 頁大小，默認為10
 * @param includeTotal 是否顯示總數
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getVoiceLIst = (page = 1, limit = 10, includeTotal = true) => {
    return ycloudInstance({
        url: '/voices', method: 'get', data: {
            page, limit, includeTotal
        }
    })
}

