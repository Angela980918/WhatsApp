import {ycloudInstance} from "@/api/http.js";

/**
 * 新建取消訂閱者
 * @param type 類型，目前僅支持PHONE_NUMBER
 * @param customer 消訂閱者的WhatsApp電話
 * @param channel 渠道，目前僅whatsapp，表示無法再接收whatsapp業務信息
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const createUnSubscriber = (type = 'PHONE_NUMBER', customer, channel = 'whatsapp') => {
    return ycloudInstance({
        url: '/unsubscribers', method: 'post', data: {
            type, customer, channel
        }
    })
}

/**
 * 取消訂閱者列表
 * @param page 頁數，默認為1
 * @param limit 頁大小，默認為10
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getUnSubscriberList = (page = 1, limit = 10) => {
    return ycloudInstance({
        url: '/unsubscribers', method: 'get', data: {
            page, limit
        }
    })
}

/**
 * 指定客戶的取消訂閱者列表
 * @param customer WhatsApp電話
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getCustomerUnSubscriberList = (customer) => {
    return ycloudInstance({
        url: `/unsubscribers/${customer}`, method: 'get'
    })
}


/**
 * 檢索指定客戶的取消訂閱者列表
 * @param customer WhatsApp電話
 * @param channel 渠道，目前僅whatsapp
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const retrieveCustomerUnSubscriberList = (customer, channel = 'whatsapp') => {
    return ycloudInstance({
        url: `/unsubscribers/${customer}/${channel}`, method: 'get'
    })
}

/**
 * 删除指定客户在指定渠道的取消订阅记录
 * @param customer
 * @param channel
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const deleteCustomerUnSubscriberList = (customer, channel = 'whatsapp') => {
    return ycloudInstance({
        url: `/unsubscribers/${customer}/${channel}`, method: 'delete'
    })
}
