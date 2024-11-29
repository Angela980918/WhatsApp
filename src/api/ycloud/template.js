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

export const createTemplate = ({
    wabaId = "449711484896804",
    name,
    language = "zh_HK",
    category,
    subCategory,
    messageSendTtlSeconds,
    components
}) => {

    // 动态构建请求数据
    const data = {
        wabaId,
        name,
        language,
        category,
        components, // 必填的直接加入
    };

    // 根据是否传入值动态添加可选参数
    if (subCategory !== undefined) data.subCategory = subCategory;
    if (messageSendTtlSeconds !== undefined) data.messageSendTtlSeconds = messageSendTtlSeconds;

    return ycloudInstance({
        url: '/whatsapp/templates', method: 'POST', data
    })
}

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

export const getTemplateList = (
    page = 1,
    limit = 10,
    includeTotal = false,
    filter = {}
) => {
    return ycloudInstance({
        url: '/whatsapp/templates', method: 'GET', data: {
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
export const deleteTemplate = ({
    wabaId = "449711484896804",
    name,
    language
}) => {

    let url = `/whatsapp/templates/${wabaId}/${name}`;
    if (language !== undefined) {
        url += `/${language}`; // 如果有 language，就拼接到 URL 中
    }
    return ycloudInstance({
        url,
        method: "DELETE"
    })
}


/**
 * @param wabaId
 * @param name
 * @param language
 * @param components
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const editTemplate = ({
    wabaId = "449711484896804",
    name,
    language = "zh_HK",
    components
}) => {
    return ycloudInstance({
        url: `/whatsapp/templates/${wabaId}/${name}/${language}`,
        method: "PATCH",
        data: {components: components}
    })
}

/**
 * @param wabaId
 * @param name
 * @param language
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const retrieveTemplate = ({
    wabaId = "449711484896804",
    name,
    language = "zh_HK"
}) => {
    return ycloudInstance({
        url: `/whatsapp/templates/${wabaId}/${name}/${language}`,
        method: "GET",
    })
}








