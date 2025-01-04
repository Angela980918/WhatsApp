import {ycloudInstance} from "@/api/http.js";

/**
 *
 * @param from
 * @param to
 * @param type
 * @param message
 * @param context
 * @param externalId
 * @param filterUnsubscribed
 * @param filterBlocked
 * @param enqueue
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const sendMessage = ({
    from,
    to,
    type,
    message,
    context,
    externalId,
    filterUnsubscribed,
    filterBlocked,
    enqueue = false,

    template
}) => {
    const data = {
        from,
        to,
        type
    }

    if(type === "template") {
        const dynamicKey = `${type}`
        // data.name = name,
        // data.language = language
        data[dynamicKey] = template
    }

    else if (type !== 'text' && message !== undefined) {
        const dynamicKey = `${type}`; // 动态变量名，例如 "text_message"
        data[dynamicKey] = { link: message }; // 动态赋值
    }else {
        const dynamicKey = `${type}`; // 动态变量名，例如 "text_message"
        data[dynamicKey] = { body: message }; // 动态赋值
    }

    if (context !== undefined) data.context = context;
    if (externalId !== undefined) data.externalId = externalId;
    if (filterUnsubscribed !== undefined) data.filterUnsubscribed = filterUnsubscribed;
    if (filterBlocked !== undefined) data.filterBlocked = filterBlocked;

    let url = '/whatsapp/messages'

    if(!enqueue) {
        url += '/sendDirectly'
    }

    return ycloudInstance({
        url: url, method: 'POST', data
    })
}

/**
 *
 * @param id
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const retrieveMessage = ({id}) => {
    return ycloudInstance({
        url: `/whatsapp/messages/${id}`,
        method: "GET",
    })
}

/**
 *
 * @param id
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const markAsReadMessage = ({id}) => {
    return ycloudInstance({
        url: `/whatsapp/inboundMessages/${id}/markAsRead`,
        method: "POST"
    })
}


