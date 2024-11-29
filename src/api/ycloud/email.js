import {ycloudInstance} from "@/api/http.js";

/**
 * 郵件發送
 * @param from 發件人郵箱
 * @param to 收件人郵箱
 * @param subject 郵件主題（最多255字符）
 * @param content 郵件正文（最大150kb）
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const sendEmail = (from, to, subject, content) => {
    return ycloudInstance({
        url: '/emails', method: 'post', data: {
            from, to, subject, content
        }
    })
}