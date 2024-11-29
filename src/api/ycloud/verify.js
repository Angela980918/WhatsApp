import {ycloudInstance} from "@/api/http.js";

/**
 * 身份驗證
 * @param channel 渠道，默認whatsapp（sms/voice/email_code）
 * @param to 收件人（WhatsApp電話/郵件地址）
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const startVerification = (channel = 'whatsapp', to) => {
    return ycloudInstance({
        url: '/verify/verifications', method: 'post', data: {
            channel, to
        }
    })
}

/**
 * 檢查驗證是否有效
 * @param id verificationID
 * @param valid 驗證碼
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const checkVerification = (id, valid) => {
    return ycloudInstance({
        url: '/verify/verificationChecks', method: 'post', data: {
            id, valid
        }
    })
}



