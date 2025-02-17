import {ycloudInstance} from "@/api/http.js";

/**
 *
 * @param page 頁數，默認為1
 * @param limit 頁大小，默認為10，1~100
 * @param includeTotal 是否顯示總數
 * @param optionPrams 其他過濾參數
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getContactList = (page = 1, limit = 10, includeTotal = false, optionPrams = {}) => {
    const requireData = {
        page, limit, includeTotal
    }
    const optionData = Object.fromEntries(Object.entries(optionPrams).map(([key, value]) => [`filter.${key}`, value]));

    const data = {
        ...requireData, ...optionData
    }

    return ycloudInstance({
        url: '/contact/contacts', method: 'get', data
    })
}

/**
 * 新建聯絡人
 * @param nickname 昵稱
 * @param phoneNumber WhatsApp電話
 * @param countryCode 國家/地區代碼
 * @param email 郵箱
 * @param tags 分類標簽
 * @param customAttributes 自定義屬性
 * @param ownerEmail 所屬郵箱
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const createContact = ({nickname, phoneNumber, countryCode, email, tags, customAttributes, ownerEmail}) => {
    console.log("")
    return ycloudInstance({
        url: '/contact/contacts', method: 'post', data: {
            nickname, phoneNumber, countryCode, email, tags, customAttributes, ownerEmail
        }
    })
}

/**
 * 檢索聯絡人
 * @param id 聯絡人ID
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const retrieveContact = id => {
    return ycloudInstance({
        url: `/contact/contacts/${id}`, method: 'get',
    })
}


/**
 * 更新聯絡人
 * @param id 聯絡人ID
 * @param nickname 昵稱
 * @param phoneNumber WhatsApp電話
 * @param countryCode 國家/地區代碼
 * @param email 郵箱
 * @param tags 分類標簽
 * @param ownerEmail 所屬郵箱
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateContact = (id, nickname, phoneNumber, countryCode, email, tags, ownerEmail) => {
    return ycloudInstance({
        url: `/contact/contacts/${id}`, method: 'patch', data: {
            nickname, phoneNumber, countryCode, email, tags, ownerEmail
        }
    })
}

/**
 * 刪除聯絡人
 * @param id 聯絡人ID
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const deleteContact = id => {
    return ycloudInstance({
        url: `/contact/contacts/${id}`, method: 'delete',
    })
}
