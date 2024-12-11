// stores/chatStore.js
import { defineStore } from 'pinia';

export const useChatStore = defineStore('chatStore', {
    state: () => ({
        currentChatId: 1,  // 当前聊天的 ID
        currentPhone: "",
        chatMessages: [],     // 当前聊天记录
        showEmoji: true,
        nowEmoji: true
    }),

    actions: {
        // 设置当前聊天的 ID
        setCurrentChatId(id) {
            this.currentChatId = id;
            // 每次切换用户时，模拟从 API 加载对应的聊天记录
            this.loadChatMessages(id);
        },
        setCurrentPhone(phone) {
            console.log("phonephone",phone)
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

        // 加载聊天记录的模拟数据
        loadChatMessages(userId) {
            // 这里模拟根据用户 ID 获取聊天记录
            // 实际情况下，你可以从接口获取数据，下面是一些模拟数据
            if (userId === 1) {
                this.chatMessages = [
                    { id: 1, user: 'John Doe', message: 'Hello, how are you?', time: '2024-12-03T12:36:00Z' },
                    { id: 2, user: 'John Doe', message: 'Let me know your thoughts on the design.', time: '2024-12-03T13:20:00Z' },
                ];
            } else if (userId === 2) {
                this.chatMessages = [
                    { id: 1, user: 'Jane Smith', message: 'Can you help with the report?', time: '2024-12-03T14:00:00Z' },
                ];
            } else if (userId === 3) {
                this.chatMessages = [
                    { id: 1, user: 'Alice Johnson', message: 'Reminder about the meeting at 4 PM.', time: '2024-12-03T15:30:00Z' },
                ];
            }
            // 可以根据用户的 id 来模拟不同的聊天记录
        },

        // 添加聊天信息
        addMessage(message) {
            console.log("addMessage",message)
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
        updateMessage(id, status) {
            this.chatMessages.map(item => {
                if(item.position === 'outbound' && item.id === id) {
                    item.status = status;
                }
            })
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
