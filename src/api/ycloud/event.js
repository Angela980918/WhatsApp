import {ycloudInstance} from "@/api/http.js";

/**
 * 新建自定義事件
 * @param name 事件名稱
 * @param label 事件標簽
 * @param description 描述
 * @param objectType 對象類型，默認為CONTACT
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const createEvent = (name, label, objectType = 'CONTACT',description) => {
    return ycloudInstance({
        url: '/event/definitions', method: 'post', data: {
            name, label, description, objectType
        }
    })
}

/**
 * 檢索事件
 * @param name 事件名稱
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const retrieveEvent = name => {
    return ycloudInstance({
        url: `/event/definitions/${name}`, method: 'get',
    })
}

/**
 *
 * @param name 事件名稱
 * @param label 事件標簽
 * @param description 描述
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateEvent = (name, label, description) => {
    return ycloudInstance({
        url: `/event/definitions/${name}`, method: 'patch', data: {
            label, description
        }
    })
}

/**
 * 新建事件屬性
 * @param eventName 事件名
 * @param name 屬性名
 * @param label 屬性標簽
 * @param description 屬性描述
 * @param type 屬性類型
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const createEventProperty = (eventName, name, label, description, type) => {
    return ycloudInstance({
        url: `/event/definitions/${eventName}/properties`, method: 'post', data: {
            name, label, description, type
        }
    })
}

/**
 * 更新事件屬性
 * @param eventName
 * @param propertyName
 * @param label
 * @param description
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateEventProperty = (eventName, propertyName, label, description) => {
    return ycloudInstance({
        url: `/event/definitions/${eventName}/properties/${propertyName}`, method: 'patch', data: {
            label, description
        }
    })
}

/**
 * 刪除事件屬性
 * @param eventName
 * @param propertyName
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const deleteEventProperty = (eventName, propertyName) => {
    return ycloudInstance({
        url: `/event/definitions/${eventName}/properties/${propertyName}`, method: 'delete'
    })
}