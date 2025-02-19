// stores/userStore.js
import {defineStore} from 'pinia';
import * as ycloudApi from "@/api/ycloud/index.js";

export const useCustomerStore = defineStore('customerStore', {
    state: () => ({
        // 当前沟通用户的 ID
        currentUserId: 1,
        currentIndex:1,
        // 當前溝通用戶的信息
        currentCustomerInfo:{},
        // 已分配客户的模拟数据
        assignedCustomers: [],
        // 未分配客户的模拟数据
        unassignedCustomers: [],
        searchWord: '', // 搜索詞
        // 聯繫人信息
        contactList: [],
        page: 1,
        total: 0
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
        },
        setUnassignedCustomers(customers) {
            this.unassignedCustomers = customers.map((customer, index) => ({
                ...customer,
                isActive: index === 0, // 默认第一个客户 isActive 为 true
            }));
        },
        setCurrentUserInfo(user) {
            this.currentCustomerInfo = user;
        },
        setSearchWord(word) {
            this.searchWord = word;
        },
        async setContactList() {
            let response = await ycloudApi.contactApi.getContactList(this.page);
            if(response !== undefined) {
                this.total = response.total;
                response.items.map(item => {
                    item.key = item.id;
                });
            }

            this.contactList = response.items;
        },
        async changeContactList(page) {
            this.page = page;
            let response = await ycloudApi.contactApi.getContactList(page, 10);
            if(response !== undefined) {
                response.items.map(item => {
                    this.total = response.total;
                    item.key = item.id;
                });
            }
            this.contactList = response.items;
        },
        contactOperate(isCreate,value) {
            if(isCreate) {
                value.key = value.id;
                this.contactList.unshift(value);
            }else {
                const index = this.contactList.findIndex(item => item.id === value.id);
                if (index !== -1) {
                    this.contactList[index] = value;  // 直接更新数组中的元素
                }
            }
        },

    },

    getters: {
        getAssignedCustomers: (state) => state.assignedCustomers,
        getAllUnReadNum: (state) => {
            const allCustomers = [...state.assignedCustomers];
            return allCustomers.reduce((count, item) => count + (item.badgeCount || 0), 0);
        },
    },
});
