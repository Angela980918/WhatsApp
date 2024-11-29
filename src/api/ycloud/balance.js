import {ycloudInstance} from "@/api/http.js";

/**
 * 查詢可用額度
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getBalance = () => {
    return ycloudInstance({
        url: '/balance', method: 'get'
    })
}