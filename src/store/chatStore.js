// stores/chatStore.js
import { defineStore } from 'pinia';
import {handleTemplateMsg} from "@/tools/index.js";
import * as whatsappApi from "@/api/whatsapp/index.js";
// import {useCustomerStore} from "@/store/customerStore";

export const useChatStore = defineStore('chatStore', {
    state: () => ({
        currentChatId: 1,  // 当前聊天的 ID
        currentPhone: "",
        currentCustomerInfo:{},
        chatMessages: [],     // 当前聊天记录
        showEmoji: true,
        nowEmoji: true,
        wabaId: "449711484896804",
        page: 1
    }),

    actions: {
        // 设置当前聊天的 ID
        setCurrentChatId(id) {
            this.currentChatId = id;
            // 每次切换用户时，模拟从 API 加载对应的聊天记录
            // this.loadChatMessages(id);
        },
        setCurrentPhone(phone) {
            // console.log("phonephone",phone)
            this.currentPhone = phone;
            // this.loadChatMessages(id);
        },
        setShowEmoji(value) {
            this.showEmoji = !this.showEmoji;
        },
        cancelEmoji() {
            this.nowEmoji = false;
            this.showEmoji = false;
        },
        setPage() {
            // console.log("777789789789789")
           this.page = 1
        },
        // 加载聊天记录的模拟数据
        async loadMoreMessages() {
            // console.log("test17777")
            ++this.page;
            let data = {
                id: this.currentChatId,
                page: this.page,
                pageSize: 20
            }
            const res = await whatsappApi.chatApi.getMessageList(data);
            let currentCustomerInfo = this.currentCustomerInfo;
            res.messageList.reverse().map((item,index) => {
                let fileExtension = "";
                item.name = currentCustomerInfo.name;
                item.color = currentCustomerInfo.color;
                item.msgIndex = this.page + `-${index}` +'-index';
                if(item.type === 'template') {
                    const name = item.content.name;
                    const language = item.content.language.code;
                    item.content = handleTemplateMsg(name, language);
                    if(item.content.header !== undefined && item.content.header.format === 'DOCUMENT') {
                        const url = item.content.header.content;
                        // console.log("url",url)
                        fileExtension = url.split('.').pop();
                        item.fileExtension = fileExtension;
                    }
                }else if(item.type === 'document') {
                    const url = item.content.link;
                    const filename = url.split('/').pop();
                    fileExtension = filename.split('.');
                    item.content.filename = filename;
                    item.fileExtension = fileExtension[1];
                }
            })
            this.chatMessages = [...res.messageList,...this.chatMessages]
        },
        setMessageList(messageList) {
            this.chatMessages = [...messageList];
        },
        // 添加聊天信息
        addMessage(message) {
          this.chatMessages.push(message);
        },
        // 模拟发送消息
        sendMessage(message) {
            if (this.currentChatId !== null) {
                this.chatMessages.push({
                    id: this.chatMessages.length + 1,
                    user: 'You', // 这里是当前用户
                    message: message,
                    time: new Date().toISOString(),  // 当前时间
                });
            }
        },
        // 更新自己的消息狀態
        updateMessage(id, status, message = {}) {
            let add = true;
            this.chatMessages.map(item => {
                if(item.direction === 'outbound' && item._id === id) {
                    add = false;
                    item.status = status;
                }
            })
            if(add && status === 'sent') {
                this.chatMessages.push(message)
            }
        },
        setCurrentUserInfo(user) {
            // console.log("usr",user)
            this.currentCustomerInfo = user;
        },

        // 清空聊天记录
        clearChat() {
            this.chatMessages = [];
        },
    },

    getters: {
        getChatMessages: (state) => state.chatMessages,
        getCurrentChatId: (state) => state.currentChatId,
    },
});
