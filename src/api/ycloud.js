import {ycloudInstance} from "@/api/http.js";

// 获取客户列表
export const getContactList = data => {
    const {
        page,
        limit,
        includeTotal
    } = data
    return ycloudInstance({
        url: '/contact/contacts',
        method: 'GET',
        data: {
            page,
            limit,
            includeTotal
        }
    })
}
