import {ycloudInstance} from "@/api/http.js";

/**
 * 發送短信
 * @param to 收件人號碼
 * @param text 短信文本内容
 * @param signature 品牌簽名
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const sendSMS = (to, text, signature) => {
    return ycloudInstance({
        url: '/sms', method: 'post', data: {
            to, text, signature
        }
    })
}

/**
 * 查詢已發短信列表
 * @param page 頁數 默認為1
 * @param limit 頁大小，默認為10
 * @param includeTotal 是否顯示總數，默認是
 * @param optionPrams 過濾參數
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getSMSList = (page = 1, limit = 10, includeTotal = true, optionPrams) => {
    const requireData = {
        page, limit, includeTotal
    }
    const optionData = Object.fromEntries(Object.entries(optionPrams).map(([key, value]) => [`filter.${key}`, value]));
    const data = {
        ...requireData, ...optionData
    }
    return ycloudInstance({
        url: '/sms', method: 'post', data
    })
}