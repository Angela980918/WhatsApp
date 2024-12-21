import {useChatStore} from "@/store/chatStore.js";
import {useCustomerStore} from "@/store/customerStore.js";
import { io } from 'socket.io-client';
const chatStore = useChatStore();
const customerStore = useCustomerStore();
let missedPongs = 0; // 记录服务器未响应的心跳次数
const MAX_MISSED_PONGS = 3; // 最大未响应心跳次数
let wsList = {};
let isReconnecting = {};  // 用来标记每个连接是否正在重连，防止重复重连
let resetTimer = null;
const eventTypes = {
    connect: "connect",
    heart: "heart",
    error: "connect_error",

    email : "email.delivery.updated",
    personCreate: "personal_whatsapp.channel.created",
    personDelete: "personal_whatsapp.channel.deleted",

    // 消息
    inbound_message: "whatsapp.inbound_message.received",
    message: "whatsapp.message.updated",

    // 模板
    template: ""
}

export const messageType = {
    failed: "failed",
    read: "read",
    sent: "sent",
    arrow: "delivered",
    accept: "accepted"
}

let wsConfigs = {
    '449711484896804': { id: '449711484896804', url: 'ws://whatsapi.jackycode.cn:4000', isContect: false }
};

const wsconnect = {
    createConnect: () => {
        // ws = await new WebSocket('ws://ws.jackycode.cn:4000', {});

        // wsconnect.resConnect('449711484896804');
        // 遍历配置并建立 WebSocket 连接
        Object.values(wsConfigs).forEach(config => {
            wsconnect.resConnect(config.id);
        });

    },

    // 可选：通过 ID 获取对应的 WebSocket 实例
    getSocketById: (id) => {
        return wsList.find(ws => ws.id === id)?.socket || null;
    },

    sendMessage: (id,message) => {
        wsList.map(item => {
            if(item.id === id) {
                item.socket.send({
                    id,
                    message
                });
                return null;
            }
        })
        return "找不到正确id";
    },

    resConnect: async (id) => {
        let config = wsConfigs[id];
        let connectWS;

        if(!config.isContect) {
            connectWS = await io(config.url,{
                query: { id: config.id },
            });
        }

        if (isReconnecting[id]) {
            console.log("已经在重连中，跳过连接请求");
            return;
        }

        isReconnecting[id] = true;  // 标记当前连接正在重连

        connectWS.on(eventTypes.connect, (value) => {
            wsConfigs[config.id].isContect = true;
            wsList[config.id] = { id: config.id, socket: connectWS, isContect: true, missedPongs: 0 };
            clearTimeout(resetTimer);
            resetTimer = null;
            console.log("已经链接")
            // 啟用心跳
            let heart = setInterval(() => {
                console.log("心跳")
                if(connectWS.connected) {
                    // 心跳啟動
                    connectWS.emit(eventTypes.heart, {
                        id: config.id,
                        message: 'ping'
                    });

                    wsList[config.id].missedPongs++;
                    if(wsList[config.id].missedPongs > MAX_MISSED_PONGS) {
                        console.log("服務未響應超過3次");
                        connectWS.disconnect();

                        clearInterval(heart);
                        heart = null;
                        // 重連
                        wsconnect.resConnect(config.id);
                    }
                }

            },5000);
        });

        connectWS.on(eventTypes.error, (error) => {
            wsConfigs[config.id].isContect = false;
            // 如果是服務未連接的錯誤，重連
            clearTimeout(resetTimer);
            resetTimer = null;
            console.log("重连");

            resetTimer = setTimeout(() => {
                isReconnecting[id] = false;  // 重连完成，标记为未在重连
                wsconnect.resConnect(config.id);  // 延迟后重试连接
            }, 5000);  // 设置延时 5 秒后重试
        });

        // 接收用戶消息
        connectWS.on(eventTypes.inbound_message, (value) => {

            let newValue = JSON.parse(value);
            console.log("newValuenewValuenewValue",newValue);

            const jsonData = newValue.data;
            let whatsappMessage = "";
            whatsappMessage = jsonData.whatsappInboundMessage;

            const assignedCustomers = customerStore.getAssignedCustomers;
            const unAssignedCustomers = customerStore.getUnassignedCustomers;

            // 如果拿出的消息是当前沟通用户，添加到当前记录
            if(chatStore.currentPhone === whatsappMessage.from) {
                let message = wsconnect.handleMessage(whatsappMessage, 'inbound')
                console.log("messagemessagemessage",message)
                // 為當前用戶添加未讀
                assignedCustomers.map(item => {
                    if(item.phoneNumber === whatsappMessage.from) {
                        item.badgeCount++;

                        if(message.type === 'text') {
                            item.message = message.title;
                        }else {
                            item.message = `${message.type} Message`
                        }
                    }
                })

                customerStore.setAssignedCustomers(assignedCustomers);
                chatStore.addMessage(message);

            }
            // 如果不是，为那条记录更新最新的消息、未读+1
            else{
                let inserOrNot = 0;

                let message = "";
                console.log("whatsappMessage.type",whatsappMessage.type,whatsappMessage.type==='text');

                if(whatsappMessage.type === 'text') {
                    console.log("whatsappMessage.type",whatsappMessage.text.body);
                    message = whatsappMessage.text.body;
                }else {
                    // message.title = whatsappMessage[whatsappMessage.type].caption;
                    // message
                    message = `[${whatsappMessage.type} message]`
                }

                // 查詢是否是來自已訂閱的用戶信息
                assignedCustomers.map(item => {
                    if(item.phoneNumber === whatsappMessage.from) {
                        inserOrNot = 1;
                        item.time = whatsappMessage.sendTime;
                        // item.message = message;

                        item.message = message;

                        item.badgeCount++;
                    }
                })


                // 查詢是否是來自未訂閱的用戶信息
                if(inserOrNot !== 1) {
                    unAssignedCustomers.map(item => {
                        if(item.phone === whatsappMessage.from) {
                            inserOrNot = 1;
                            item.time = whatsappMessage.sendTime;
                            // item.message = message;

                            item.message = message;
                            item.badgeCount++;
                        }
                    })
                }else {
                //     已訂閱更新
                    customerStore.setAssignedCustomers(assignedCustomers);
                    return;
                }

                // 插入新用戶
                if(inserOrNot !== 1) {
                    const userName = whatsappMessage.customerProfile.name;



                    unAssignedCustomers.push({
                        phone: whatsappMessage.from,
                        name: userName,
                        time: whatsappMessage.sendTime,
                        message: message,
                        badgeCount: 1
                    })
                }

                // 更新未訂閱
                customerStore.setUnassignedCustomers(unAssignedCustomers);
                // chatStore.addMessage(message);

            }
        })

        // 本人發送消息
        connectWS.on(eventTypes.message, (value) => {

            let newValue = JSON.parse(value);
            const jsonData = newValue.data;
            console.log("newValuenewValuenewValue", newValue);
            let whatsappMessage = "";
            whatsappMessage = jsonData.whatsappMessage;

            let message = wsconnect.handleMessage(whatsappMessage, "outbound")

            const type = whatsappMessage.status;

            // let message = {
            //     position: "outbound",
            //     id: whatsappMessage.id,
            //     type: whatsappMessage.type,
            //     status: whatsappMessage.status
            // }
            //
            // if(whatsappMessage.type === 'text') {
            //     message.title = whatsappMessage.text.body;
            // }else {
            //     message.link = whatsappMessage[whatsappMessage.type].link
            //     message.title = whatsappMessage[whatsappMessage.type].caption
            // }
            // message.time = whatsappMessage.sendTime;

            switch (type) {
                case messageType.sent:
                    chatStore.updateMessage(whatsappMessage.id, messageType.sent, message);
                    break;
                case messageType.arrow:
                    chatStore.updateMessage(whatsappMessage.id, messageType.arrow);
                    break;
                case messageType.failed:
                    chatStore.updateMessage(whatsappMessage.id, messageType.failed);
                    break;
                case messageType.read:
                    chatStore.updateMessage(whatsappMessage.id, messageType.read);
                    break;
                default:
                    break
            }
        })

        connectWS.on(eventTypes.heart, (id) => {
            if(wsList[id] !== undefined) {
                wsList[id].missedPongs = 0;
            }
        })

        connectWS.on('template', (value) => {
            console.log("value",value)
        });

    },

    handleMessage: (whatsAppMessage, position) => {
        whatsAppMessage.sendTime = undefined;
        let message = {
            position: position,
            id: whatsAppMessage.id,
            type: whatsAppMessage.type,
            status: whatsAppMessage.status,
            time: whatsAppMessage.sendTime
        }

        if(whatsAppMessage.type === 'text') {
            message.title = whatsAppMessage.text.body;
        }else if(whatsAppMessage.type === 'image' || whatsAppMessage.type === 'video' || whatsAppMessage.type === 'document'){
            message.link = whatsAppMessage[whatsAppMessage.type].link
            message.title = whatsAppMessage[whatsAppMessage.type].caption
        }

        return message;
    }
};

export default wsconnect;
