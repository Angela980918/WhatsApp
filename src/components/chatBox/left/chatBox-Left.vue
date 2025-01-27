<template>
  <a-layout-sider width="300" :collapsed-width="300" :style="siderStyle">
    <!--  搜索框  -->
    <chat-box-left-search></chat-box-left-search>

    <!--  分配列表 :unassignedCustomersData="unassignedCustomers" -->
    <chat-box-left-list :assignedCustomersData="assignedCustomers"
                         @loadChatMessage="loadChatMessage"></chat-box-left-list>

  </a-layout-sider>
</template>

<script lang="ts" setup>
import {computed, CSSProperties, onBeforeMount, onMounted, ref} from "vue";
import ChatBoxLeftSearch from "@/components/chatBox/left/chatBox-Left-Search.vue";
import ChatBoxLeftList from "@/components/chatBox/left/chatBox-Left-List.vue";
import {handleTemplateMsg} from '@/tools/modules/common'
import {useCustomerStore} from "@/store/customerStore";
import {useChatStore} from "@/store/chatStore";

import * as ycloudApi from "@/api/ycloud/index.js";
import * as whatsappApi from "@/api/whatsapp/index.js";

// 获取 userStore 和 chatStore
const customerStore = useCustomerStore();
const chatStore = useChatStore();

const assignedCustomers = computed(() => customerStore.getAssignedCustomers);
// const unassignedCustomers = computed(() => customerStore.getUnassignedCustomers);


// 选中的客户
async function loadChatMessage(guestPhone, id) {
  if(chatStore.currentPhone !== guestPhone) {
      chatStore.clearChat();
      chatStore.setPage();
      chatStore.setCurrentChatId(id)
      chatStore.setCurrentPhone(guestPhone)
      loadMessageList();
  }
}

onBeforeMount(async () => {
    if(assignedCustomers.value.length === 0) {
        await loadCustomerList()
    }else {
        chatStore.setCurrentUserInfo(assignedCustomers.value[0]);
        // chatStore.setCurrentChatId();
        loadChatMessage(assignedCustomers.value[0].phoneNumber, assignedCustomers.value[0].id);
    }
})

const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// 加载用户列表
const loadCustomerList = async () => {
    const res = await whatsappApi.chatApi.getAllCustomer();
    const customer = [];
    res.map(item => {
        item.key = item._id;
        const color = generateRandomColor();
        let newCustomer = {
            id: item._id,
            key: item.key,
            name: item.customerId,
            time: item.messageList[0].deliverTime,
            badgeCount: item.messageCount,
            phoneNumber: item.customerId,
            color: color
        }

        if(item.customerProfile != undefined) {
            newCustomer.name = item.customerProfile.name;
        }

        if(item.messageList[0].type === 'text') {
            newCustomer.message = item.messageList[0].content.body;
        }else {
            newCustomer.message = `[${item.messageList[0].type} Message]`;
        }

        customer.push(newCustomer);
    });
    // console.log("customer",customer)
    customerStore.setAssignedCustomers(customer);
    // chatStore.setCurrentPhone(customer[0].phoneNumber);
    chatStore.setCurrentUserInfo(customer[0]);
    // chatStore.setCurrentChatId()
    loadChatMessage(customer[0].phoneNumber, assignedCustomers.value[0].id)
}

// 加载消息列表
const loadMessageList = async () => {
    let currentChatId = chatStore.getCurrentChatId;
    let currentCustomerInfo = chatStore.currentCustomerInfo;
    chatStore.setPage();
    let data = {
        id: currentChatId,
        page: 1,
        pageSize: 20
    }
    const res = await whatsappApi.chatApi.getMessageList(data);

    res.messageList.reverse().map((item,index) => {
        let fileExtension = "";
        item.name = currentCustomerInfo.name;
        item.color = currentCustomerInfo.color;
        item.msgIndex = '1' + `-${index}` +'-index';
        if(item.type === 'template') {
            const name = item.content.name;
            const language = item.content.language.code;
            item.content = handleTemplateMsg(name, language);
            if(item.content.header != undefined && item.content.header.format === 'DOCUMENT') {
                const url = item.content.header.content;
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

    chatStore.setMessageList(res.messageList);
}

const siderStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  "padding-left": '12px',
  "padding-right": '12px',
  "padding-top": '12px',
  overflowY: 'auto',
  backgroundColor: 'transparent',
}
</script>

<style scoped>

</style>
