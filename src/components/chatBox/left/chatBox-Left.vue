<template>
  <a-layout-sider width="300" :collapsed-width="300" :style="siderStyle">
    <!--  搜索框  -->
    <chat-box-left-search></chat-box-left-search>

    <!--  分配列表  -->
    <chat-box-left-list :assignedCustomersData="assignedCustomers"
                        :unassignedCustomersData="unassignedCustomers" @loadLocalMessage="loadLocalMessage"></chat-box-left-list>

  </a-layout-sider>
</template>

<script lang="ts" setup>
import {computed, CSSProperties, onBeforeMount, onMounted, ref} from "vue";
import ChatBoxLeftSearch from "@/components/chatBox/left/chatBox-Left-Search.vue";
import ChatBoxLeftList from "@/components/chatBox/left/chatBox-Left-List.vue";

import {useCustomerStore} from "@/store/customerStore";
import {useChatStore} from "@/store/chatStore";

import * as ycloudApi from "@/api/ycloud/index.js";
import * as whatsappApi from "@/api/whatsapp/index.js";

// 获取 userStore 和 chatStore
const customerStore = useCustomerStore();
const chatStore = useChatStore();

// const assignedCustomers = computed(() => customerStore.getAssignedCustomers);
const assignedCustomers = computed(() => customerStore.getAssignedCustomers);
const unassignedCustomers = computed(() => customerStore.getUnassignedCustomers);

// 选中的客户
const handleSelectCustomer = (phone, id) => {
  // 更新当前聊天的用户 ID
  // customerStore.setCurrentUser(id);
  chatStore.setCurrentPhone(phone, id);  // 设置当前聊天 ID，并加载聊天记录
};

async function loadLocalMessage(guestPhone, userPhone) {
    // console.log("guestPhone, userPhone",guestPhone, userPhone)
  const key = guestPhone + '_' + userPhone;
    // console.log("keykeykeykey",key)
  const chatMessageStr = await localStorage.getItem(key);
    // console.log("chatMessageStr",chatMessageStr)
  const MessageList = JSON.parse(chatMessageStr);
  if(MessageList !== null) {
    chatStore.setMessageList(MessageList);
  }


}

onBeforeMount(async () => {
    const assignedCustomers = await JSON.parse(localStorage.getItem("assignedCustomers"));
    customerStore.setAssignedCustomers(assignedCustomers);
})

const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

onMounted(async () => {

    if(assignedCustomers.value.length === 0) {
        const res = await whatsappApi.chatApi.getAllCustomer();
        // console.log("response",res)
        const customer = [];
        res.map(item => {
            // item.tags = ['test1', 'test2'];
            item.key = item._id;
            const color = generateRandomColor();
            let newMessage = {
                id: item._id,
                key: item.key,
                name: item.customerId,
                time: item.messageList[0].deliverTime,
                badgeCount: item.messageCount,
                phoneNumber: item.customerId,
                color: color
            }

            if(item.customerProfile != undefined) {
                newMessage.name = item.customerProfile.name;
            }

            if(item.messageList[0].type === 'text') {
                newMessage.message = item.messageList[0].content.body;
            }else {
                newMessage.message = `[${item.messageList[0].type} Message]`;
            }

            customer.push(newMessage);
        });
        // console.log("customercustomer",customer)
        customerStore.setAssignedCustomers(customer);
        handleSelectCustomer(customer[0].phoneNumber, customer[0]._id);
        customerStore.setCurrentUserInfo(customer[0]);
        loadLocalMessage(customer[0].phoneNumber, "+8613672967202")
    }

})

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
