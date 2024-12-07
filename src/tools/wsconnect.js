let wsList = [];
import {useChatStore} from "@/store/chatStore.js";
const chatStore = useChatStore();

const wsconnect = {
    createConnect: () => {
        // ws = await new WebSocket('ws://ws.jackycode.cn:4000', {});
        const wsConfigs = [
            { id: '449711484896804', url: 'ws://ws.jackycode.cn:4000' }

        ];

        // 遍历配置并建立 WebSocket 连接
        wsConfigs.forEach(config => {
            const connectWS = new WebSocket(config.url, [config.id]);

            connectWS.onopen = () => {
                console.log(`[${config.id}] 已建立连接`);
            };

            connectWS.onmessage = (event) => {
                // console.log(`[${config.id}] 收到消息:`, event);
                const { data } = event
                // 根据消息类型处理事件
                if (data instanceof Blob) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        try {
                            const textData = reader.result; // 转换为字符串
                            const jsonData = JSON.parse(textData); // 解析为 JSON 对象
                            const whatsappMessage = jsonData.whatsappMessage;
                            // 如果是当前的用户发送的，添加到记录
                            console.log("chatStore.currentPhone",chatStore.currentPhone)
                            console.log("whatsappMessage.from",whatsappMessage.from)
                            if(chatStore.currentPhone === whatsappMessage.from && whatsappMessage.status === "delivered") {
                                let message = {
                                    position: "left",
                                    title: whatsappMessage.text.body,
                                    time: whatsappMessage.sendTime
                                }
                                chatStore.addMessage(message);
                            }
                            // 如果是其他用户发送的，更新记录
                            // 如果是自己发送的

                            // 根据解析后的 JSON 数据处理逻辑
                        } catch (error) {
                            console.error(`[${config.id}] JSON 解析错误:`, error, textData);
                        }
                    };
                    reader.readAsText(data); // 将 Blob 转换为文本
                } else {
                    try {
                        const jsonData = JSON.parse(data); // 如果 data 已是字符串，直接解析
                        let whatsappMessage = "";
                        if(jsonData.type === "whatsapp.message.updated") {
                            whatsappMessage = jsonData.whatsappMessage
                        }else if(jsonData.type === "whatsapp.inbound_message.received") {
                            whatsappMessage = jsonData.whatsappInboundMessage
                        }
                        console.log("chatStore.currentPhone",chatStore.currentPhone)
                        console.log("whatsappMessage.from",whatsappMessage.from)
                        if(chatStore.currentPhone === whatsappMessage.from) {
                            let message = {
                                position: "left",
                                title: whatsappMessage.text.body,
                                time: whatsappMessage.sendTime
                            }
                            chatStore.addMessage(message);
                        }

                        console.log(`[${config.id}] 收到消息:`, jsonData);
                    } catch (error) {
                        console.error(`[${config.id}] JSON 解析错误:`, error, data);
                    }
                }
            };

            connectWS.onclose = () => {
                console.log(`[${config.id}] 连接已关闭`);
            };

            connectWS.onerror = (err) => {
                console.error(`[${config.id}] 连接发生错误:`, err);
            };

            // 将 WebSocket 和对应的 ID 存入 wsList
            wsList.push({ id: config.id, socket: connectWS });
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
    }
};

export default wsconnect;
