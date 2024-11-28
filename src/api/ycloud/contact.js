import {ycloudInstance} from "@/api/http.js";

/**
 *
 * @param page
 * @param limit
 * @param includeTotal
 * @param tags
 * @param countryCode
 * @param phoneNumber
 * @param email
 * @returns {Promise<axios.AxiosResponse<any>>}
 */

export const getContactList = (page = 1, limit = 10, includeTotal = false, tags, countryCode, phoneNumber, email) => {
    return ycloudInstance({
        url: '/contact/contacts', method: 'get', data: {
            page,
            limit,
            includeTotal,
            'filter.tags': tags,
            'filter.countryCode': countryCode,
            'filter.phoneNumber': phoneNumber,
            'filter.email': email
        }
    })
}

// const {
//     page = 1, limit = 10, includeTotal = false, tags, countryCode, phoneNumber, email
// } = data;

/**
 * 創建新的聯絡人
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const createContact = data => {
    const {
        nickname, phoneNumber, countryCode, email, tags, customAttributes, ownerEmail
    } = data;
    return ycloudInstance({
        url: '/contact/contacts', method: 'post', data: {
            nickname, phoneNumber, countryCode, email, tags, customAttributes, ownerEmail
        }
    })
}

/**
 * 檢索某個聯絡人
 * @param contactId 聯絡人ID
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const retrieveContact = contactId => {
    return ycloudInstance({
        url: `/contact/contacts/${contactId}`, method: 'get',
    })
}


/**
 * 更新某個聯絡人
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateContact = data => {
    const {
        contactId, nickname, phoneNumber, countryCode, email, tags, customAttributes, ownerEmail
    } = data;
    return ycloudInstance({
        url: `/contact/contacts/${contactId}`, method: 'patch', data: {
            nickname, phoneNumber, countryCode, email, tags, customAttributes, ownerEmail
        }
    })
}

/**
 * 刪除某個聯絡人
 * @param contactId 聯絡人ID
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const deleteContact = contactId => {
    return ycloudInstance({
        url: `/contact/contacts/${contactId}`, method: 'delete',
    })
}