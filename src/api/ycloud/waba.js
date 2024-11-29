import {ycloudInstance} from "@/api/http.js";

/**
 *
 * @param page
 * @param limit
 * @param includeTotal
 * @param filter
 * @param filter.wabaId
 * @param filter.name
 * @param filter.language
 * @returns {Promise<axios.AxiosResponse<any>>}
 */

export const getWABAList = (
    page = 1,
    limit = 10,
    includeTotal = false,
    filter = {}
) => {
    return ycloudInstance({
        url: '/whatsapp/businessAccounts', method: 'GET', data: {
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
 * @param language
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const retrieveWABA = ({id}) => {
    return ycloudInstance({
        url: `/whatsapp/businessAccounts/${id}`,
        method: "GET",
    })
}








