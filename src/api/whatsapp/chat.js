import {whatsappInstance} from "@/api/http.js";


/**
 * 查詢沟通列表
 */
export const getAllCustomer = () => {
    return whatsappInstance({
        url: '/chat/getAllCustomerLatestChats?wabaId=449711484896804', method: 'GET'
    })
}

/**
 * 查詢消息列表
 */
export const getMessageList = ({ id, page, pageSize }) => {

    return whatsappInstance({
        url: `/chat?roomId=${id}&pageIndex=${page}&pageSize=${pageSize}`, method: 'GET'
    })
}
