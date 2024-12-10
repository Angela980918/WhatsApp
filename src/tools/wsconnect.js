import {useChatStore} from "@/store/chatStore.js";
const chatStore = useChatStore();
let missedPongs = 0; // 记录服务器未响应的心跳次数
const MAX_MISSED_PONGS = 3; // 最大未响应心跳次数
let wsList = {};
// let resetTimer;

let wsConfigs = {
    //
    '449711484896804': { id: '449711484896804', url: 'ws://127.0.0.1:4000', isContect: false },
    '449711484896805': { id: '449711484896805', url: 'ws://127.0.0.1:4000', isContect: false }
};

const wsconnect = {
    createConnect: () => {
        // ws = await new WebSocket('ws://ws.jackycode.cn:4000', {});


        // 遍历配置并建立 WebSocket 连接
        Object.values(wsConfigs).forEach(config => {
            wsconnect.resConnect(config.id);

            // let connectWS;
            // if(!config.isContect) {
            //     connectWS = new WebSocket(config.url, [config.id]);
            // }
            //
            // connectWS.onopen = () => {
            //     console.log(`[${config.id}] 已建立连接`);
            //     config.isContect = true;
            //
            //     // 将 WebSocket 和对应的 ID 存入 wsList
            //     wsList[config.id] = { id: config.id, socket: connectWS, isContect: true };
            // };
            //
            // connectWS.onmessage = (event) => {
            //     // console.log(`[${config.id}] 收到消息:`, event);
            //     const { data } = event
            //     // 根据消息类型处理事件
            //     if (data instanceof Blob) {
            //         const reader = new FileReader();
            //         reader.onload = () => {
            //             try {
            //                 const textData = reader.result; // 转换为字符串
            //                 const jsonData = JSON.parse(textData); // 解析为 JSON 对象
            //                 const whatsappMessage = jsonData.whatsappMessage;
            //                 // 如果是当前的用户发送的，添加到记录
            //                 console.log("chatStore.currentPhone",chatStore.currentPhone)
            //                 console.log("whatsappMessage.from",whatsappMessage.from)
            //                 if(chatStore.currentPhone === whatsappMessage.from && whatsappMessage.status === "delivered") {
            //                     let message = {
            //                         position: "left",
            //                         title: whatsappMessage.text.body,
            //                         time: whatsappMessage.sendTime
            //                     }
            //                     chatStore.addMessage(message);
            //                 }
            //                 // 如果是其他用户发送的，更新记录
            //                 // 如果是自己发送的
            //
            //                 // 根据解析后的 JSON 数据处理逻辑
            //             } catch (error) {
            //                 console.error(`[${config.id}] JSON 解析错误:`, error, textData);
            //             }
            //         };
            //         reader.readAsText(data); // 将 Blob 转换为文本
            //     } else {
            //         try {
            //             const jsonData = JSON.parse(data); // 如果 data 已是字符串，直接解析
            //             let whatsappMessage = "";
            //             if(jsonData.type === "whatsapp.message.updated") {
            //                 whatsappMessage = jsonData.whatsappMessage
            //             }else if(jsonData.type === "whatsapp.inbound_message.received") {
            //                 whatsappMessage = jsonData.whatsappInboundMessage
            //             }
            //             console.log("chatStore.currentPhone",chatStore.currentPhone)
            //             console.log("whatsappMessage.from",whatsappMessage.from)
            //             if(chatStore.currentPhone === whatsappMessage.from) {
            //                 let message = {
            //                     position: "left",
            //                     title: whatsappMessage.text.body,
            //                     time: whatsappMessage.sendTime
            //                 }
            //                 chatStore.addMessage(message);
            //             }
            //
            //             console.log(`[${config.id}] 收到消息:`, jsonData);
            //         } catch (error) {
            //             console.error(`[${config.id}] JSON 解析错误:`, error, data);
            //         }
            //     }
            // };
            //
            // connectWS.onclose = () => {
            //     console.log(`[${config.id}] 连接已关闭`);
            //     config.isContect = false;
            //     wsList[config.id].isContect = false;
            //     //     斷線後重連
            //     wsconnect.resConnect(config.id)
            // };
            //
            // connectWS.onerror = (err) => {
            //     console.error(`[${config.id}] 连接发生错误:`,err);
            //
            //     // 如果是服務未連接的錯誤，重連
            //     if(wsList[config.id].isContect) {
            //         wsconnect.resConnect(config.id)
            //     }
            // };
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

    resConnect: (id) => {
        let config = wsConfigs[id];
        let connectWS;
        let resetTimer = null;

        if(!config.isContect) {
            connectWS = new WebSocket(config.url, [config.id]);
        }
        console.log("configconfigconfig",config)
        connectWS.onopen = () => {
            console.log(`[${config.id}] 已建立连接`);
            wsConfigs[config.id].isContect = true;

            // 将 WebSocket 和对应的 ID 存入 wsList
            wsList[config.id] = { id: config.id, socket: connectWS, isContect: true };
            clearTimeout(resetTimer);
            resetTimer = null;

            // 啟用心跳
            let heart = setInterval(() => {
                if(connectWS.readyState === WebSocket.OPEN) {
                    // 心跳啟動
                    console.log("心跳")
                    connectWS.send(JSON.stringify({
                        wabaId: config.id,
                        message: 'ping'
                    }));
                    missedPongs++;
                    if(missedPongs > MAX_MISSED_PONGS) {
                        console.log("服務未響應超過3次");
                        connectWS.close();

                        clearInterval(heart);
                        heart = null;
                        // 重連
                        wsconnect.resConnect(config.id);
                    }
                }

            },5000);

        };

        connectWS.onmessage = (event) => {
            // console.log(`[${config.id}] 收到消息:`, event);
            const { data } = event
            console.log("event", event)
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

                    if(jsonData.type === "pong"){
                        console.log("心跳收到");
                        missedPongs = 0;
                        return
                    }

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
            wsConfigs[config.id].isContect = false;
            // 如果是服務未連接的錯誤，重連
            clearTimeout(resetTimer);
            resetTimer = null;
            // console.log("111111111")
            resetTimer = setTimeout(() => {
                console.log("testtest")
                if(!wsConfigs[config.id].isContect) {
                    wsconnect.resConnect(config.id);
                }else {
                    clearTimeout(resetTimer);
                    resetTimer = null;
                }
            }, 5000)
            // config.isContect = false;
            // //
            //
            // if(Object.values(wsList) === 0 || wsList[config.id] === undefined) {
            //     // 如果是未放入列表的，觸發重連, 不處理，onError會處理
            // }else {
            //     // 如果是正常斷開，觸發重連
            //     wsList[config.id].isContect = false;
            //     console.log("222222222")
            //     wsconnect.resConnect(config.id);
            // }
            // wsconnect.resConnect(config.id);
            // 每十秒重新連一次
            // 清理上一個記錄
            // resetTimer = setTimeout(() => {
            //     if(!wsList[config.id].isContect) {
            //         wsconnect.resConnect(config.id);
            //     }else {
            //         resetTimer = null;
            //     }
            // }, 10000)

        };

        connectWS.onerror = (err) => {
            console.error(`[${config.id}] 连接发生错误:`);

        };
    }
};

export default wsconnect;
