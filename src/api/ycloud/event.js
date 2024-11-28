import {ycloudInstance} from "@/api/http.js";

/**
 * 創建自定義事件
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const createEvent = data => {
    const {
        name, label, description, objectType = 'CONTACT'
    } = data;
    return ycloudInstance({
        url: '/event/definitions', method: 'post', data: {
            name, label, description, objectType
        }
    })
}

/**
 * 檢索某個自定義事件
 * @param eventName 事件名
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const retrieveEvent = eventName => {
    return ycloudInstance({
        url: `/event/definitions/${eventName}`, method: 'get',
    })
}

/**
 * 更新某個事件
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateEvent = data => {
    const {
        eventName, label, description
    } = data;
    return ycloudInstance({
        url: `/event/definitions/${eventName}`, method: 'patch', data: {
            label, description
        }
    })
}

/**
 * 自定義事件屬性
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const createEventProperty = data => {
    const {
        eventName, name, label, description, type
    } = data;
    return ycloudInstance({
        url: `/event/definitions/${eventName}/properties`, method: 'post', data: {
            name, label, description, type
        }
    })
}

/**
 * 更新自定義事件屬性
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateEventProperty = data => {
    const {
        eventName, propertyName, label, description, type
    } = data;
    return ycloudInstance({
        url: `/event/definitions/${eventName}/properties/${propertyName}`, method: 'patch', data: {
            name, label, description, type
        }
    })
}