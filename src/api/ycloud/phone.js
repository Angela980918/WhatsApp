import {ycloudInstance} from "@/api/http.js";

/**
 *
 * @param wabaId
 * @param name
 * @param language
 * @param category
 * @param subCategory
 * @param messageSendTtlSeconds
 * @param components
 * @returns {Promise<axios.AxiosResponse<any>>}
 */

export const createPhoneNumber = ({
    wabaId = "449711484896804",
    phoneNumber
}) => {

    return ycloudInstance({
        url: `/whatsapp/phoneNumbers/${wabaId}/${phoneNumber}/register`, method: 'POST'
    })
}

/**
 *
 * @param page
 * @param limit
 * @param includeTotal
 * @param filter
 * @param filter.wabaId
 * @returns {Promise<axios.AxiosResponse<any>>}
 */

export const getPhoneList = (
    page = 1,
    limit = 10,
    includeTotal = false,
    filter = {}
) => {
    return ycloudInstance({
        url: '/whatsapp/phoneNumbers', method: 'GET', data: {
            page,
            limit,
            includeTotal,
            ...Object.keys(filter).reduce((acc, key) => {
                acc[`filter.${key}`] = filter[key];
                return acc;
            }, {})
        }
    })
}

/**
 * @param wabaId
 * @param name
 * @param phoneNumber
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updatePhoneProfile = ({
    wabaId = "449711484896804",
    phoneNumber,
    data}) => {
    return ycloudInstance({
        url: `/whatsapp/phoneNumbers/${wabaId}/${phoneNumber}/profile`,
        method: "PATCH",
        data
    })
}

/**
 * @param wabaId
 * @param name
 * @param profile
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const retrievePhoneNumber = ({
    wabaId = "449711484896804",
    phoneNumber,
    profile = false
}) => {

    let url = `/whatsapp/phoneNumbers/${wabaId}/${phoneNumber}`;
    if(profile) {
        url += `/profile`
    }

    return ycloudInstance({
        url,
        method: "GET",
    })
}

/**
 * @param wabaId
 * @param name
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const retrieveCommerceSetting = ({
    wabaId = "449711484896804",
    phoneNumber,
}) => {

    let url = `/whatsapp/phoneNumbers/${wabaId}/${phoneNumber}/whatsappCommerceSettings`;

    return ycloudInstance({
        url,
        method: "GET",
    })
}

/**
 * @param wabaId
 * @param name
 * @param phoneNumber
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateCommerceSetting = ({
wabaId = "449711484896804",
phoneNumber,
data}) => {
    return ycloudInstance({
        url: `/whatsapp/templates/${wabaId}/${phoneNumber}/whatsappCommerceSettings`,
        method: "PATCH",
        data
    })
}









