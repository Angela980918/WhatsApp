// stores/userStore.js
import {defineStore} from 'pinia';

export const useCustomerStore = defineStore('customerStore', {
    state: () => ({
        // 当前沟通用户的 ID
        currentUserId: 1,
        currentIndex:1,
        // 當前溝通用戶的信息
        currentCustomerInfo:{},
        // 已分配客户的模拟数据
        assignedCustomers: [
            // {id: 1, name: 'John Doe', time: '2024-12-03T12:36:00Z', message: 'Hello, how are you?', badgeCount: 5},
            // {
            //     id: 2,
            //     name: 'Jane Smith',
            //     time: '2024-12-03T14:00:00Z',
            //     message: 'Can you help with the report?',
            //     badgeCount: 2
            // },
            // {
            //     id: 3,
            //     name: 'Alice Johnson',
            //     time: '2024-12-03T15:30:00Z',
            //     message: 'Reminder about the meeting at 4 PM.',
            //     badgeCount: 3
            // },
            // {
            //     id: 4,
            //     name: 'Charlie Davis',
            //     time: '2024-12-03T13:20:00Z',
            //     message: 'Let me know your thoughts on the new design.',
            //     badgeCount: 4
            // },
            // {
            //     id: 5,
            //     name: 'Charlie Davis',
            //     time: '2024-12-03T13:20:00Z',
            //     message: 'Let me know your thoughts on the new design.',
            //     badgeCount: 4
            // },
            // {
            //     id: 6,
            //     name: 'Jane Smith',
            //     time: '2024-12-03T14:00:00Z',
            //     message: 'Can you help with the report?',
            //     badgeCount: 2
            // },
            // {
            //     id: 7,
            //     name: 'Alice Johnson',
            //     time: '2024-12-03T15:30:00Z',
            //     message: 'Reminder about the meeting at 4 PM.',
            //     badgeCount: 3
            // },
            // {
            //     id: 8,
            //     name: 'Jane Smith',
            //     time: '2024-12-03T14:00:00Z',
            //     message: 'Can you help with the report?',
            //     badgeCount: 2
            // },
            // {
            //     id: 9,
            //     name: 'Alice Johnson',
            //     time: '2024-12-03T15:30:00Z',
            //     message: 'Reminder about the meeting at 4 PM.',
            //     badgeCount: 3
            // },
            // {
            //     id: 10,
            //     name: 'Charlie Davis',
            //     time: '2024-12-03T13:20:00Z',
            //     message: 'Let me know your thoughts on the new design.',
            //     badgeCount: 4
            // },
            // {
            //     id: 11,
            //     name: 'Charlie Davis',
            //     time: '2024-12-03T13:20:00Z',
            //     message: 'Let me know your thoughts on the new design.',
            //     badgeCount: 4
            // },         {
            //     id: 12,
            //     name: 'Jane Smith',
            //     time: '2024-12-03T14:00:00Z',
            //     message: 'Can you help with the report?',
            //     badgeCount: 2
            // },
            // {
            //     id: 13,
            //     name: 'Alice Johnson',
            //     time: '2024-12-03T15:30:00Z',
            //     message: 'Reminder about the meeting at 4 PM.',
            //     badgeCount: 3
            // },
            // {
            //     id: 14,
            //     name: 'Charlie Davis',
            //     time: '2024-12-03T13:20:00Z',
            //     message: 'Let me know your thoughts on the new design.',
            //     badgeCount: 4
            // },
            // {
            //     id: 15,
            //     name: 'Charlie Davis',
            //     time: '2024-12-03T13:20:00Z',
            //     message: 'Let me know your thoughts on the new design.',
            //     badgeCount: 4
            // },         {
            //     id: 16,
            //     name: 'Jane Smith',
            //     time: '2024-12-03T14:00:00Z',
            //     message: 'Can you help with the report?',
            //     badgeCount: 2
            // },
            // {
            //     id: 17,
            //     name: 'Alice Johnson',
            //     time: '2024-12-03T15:30:00Z',
            //     message: 'Reminder about the meeting at 4 PM.',
            //     badgeCount: 3
            // },
            // {
            //     id: 18,
            //     name: 'Charlie Davis',
            //     time: '2024-12-03T13:20:00Z',
            //     message: 'Let me know your thoughts on the new design.',
            //     badgeCount: 4
            // },
            // {
            //     id: 19,
            //     name: 'Charlie Davis',
            //     time: '2024-12-03T13:20:00Z',
            //     message: 'Let me know your thoughts on the new design.',
            //     badgeCount: 4
            // },
        ],
        // 未分配客户的模拟数据
        unassignedCustomers: [
            // {
            //     id: 20,
            //     name: 'Bob Brown',
            //     time: '2024-12-03T10:00:00Z',
            //     message: 'Have you reviewed the new project proposal?',
            //     badgeCount: 1
            // },
            // {
            //     id: 21,
            //     name: 'Charlie Davis',
            //     time: '2024-12-03T13:20:00Z',
            //     message: 'Let me know your thoughts on the new design.',
            //     badgeCount: 4
            // },
        ],
        ws: null
    }),
    actions: {
        setCurrentUser(id) {
            this.currentUserId = id;
        },
        setAssignedCustomers(customers) {
            this.assignedCustomers = customers.map((customer, index) => ({
                ...customer,
                isActive: index === 0, // 默认第一个客户 isActive 为 true
            }));
            // console.log("this.assignedCustomers", this.assignedCustomers);

        },
        setUnassignedCustomers(customers) {
            this.unassignedCustomers = customers.map((customer, index) => ({
                ...customer,
                isActive: index === 0, // 默认第一个客户 isActive 为 true
            }));
        },
        //     建立连接
        async createConnect() {
            this.ws = await new WebSocket('ws://ws.jackycode.cn:4000', );
            // 设置 WebSocket 连接打开事件
            this.ws.onopen = () => {
                console.log("已建立連接")
            };

            // 设置 WebSocket 连接消息事件
            this.ws.onmessage = (event) => {
                // console.log("event",event)
                // console.log('[CLIENT] Received message:', event.data);
            };

            // 设置 WebSocket 连接关闭事件
            this.ws.onclose = () => {
                // console.log('[CLIENT] Connection closed');
            };

            // 设置 WebSocket 错误事件
            this.ws.onerror = (err) => {
                // console.error('[CLIENT] Error:', err);
            };
        },
        sendMessage(message) {
            this.ws.send('message', message);
        },
        setCurrentUserInfo(user) {
            this.currentCustomerInfo = user;
        },
    },

    getters: {
        getAssignedCustomers: (state) => state.assignedCustomers,
        getUnassignedCustomers: (state) => state.unassignedCustomers,
    },
});
