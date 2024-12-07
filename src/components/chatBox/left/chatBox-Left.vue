<template>
  <a-layout-sider width="300" :collapsed-width="300" :style="siderStyle">
    <!--  搜索框  -->
    <chat-box-left-search></chat-box-left-search>

    <!--  分配列表  -->
    <chat-box-left-list :assignedCustomersData="assignedCustomers"
                        :unassignedCustomersData="unassignedCustomers"></chat-box-left-list>

  </a-layout-sider>
</template>

<script lang="ts" setup>
import {computed, CSSProperties, onMounted, ref} from "vue";
import ChatBoxLeftSearch from "@/components/chatBox/left/chatBox-Left-Search.vue";
import ChatBoxLeftList from "@/components/chatBox/left/chatBox-Left-List.vue";

import {useCustomerStore} from "@/store/customerStore";
import {useChatStore} from "@/store/chatStore";

import * as ycloudApi from "../../../api/ycloud/index.js";

// 获取 userStore 和 chatStore
const customerStore = useCustomerStore();
const chatStore = useChatStore();

// const assignedCustomers = computed(() => customerStore.getAssignedCustomers);
const assignedCustomers = ref([]);
const unassignedCustomers = computed(() => customerStore.getUnassignedCustomers);

// 选中的客户
const handleSelectCustomer = (id) => {
  // 更新当前聊天的用户 ID
  customerStore.setCurrentUser(id);
  chatStore.setCurrentChatId(id);  // 设置当前聊天 ID，并加载聊天记录
};

onMounted(async () => {
    let response = await ycloudApi.contactApi.getContactList();
    let result = response.data;
    result.items.map(item => {
        // item.tags = ['test1', 'test2'];
        item.key = item.id;
        assignedCustomers.value.push(item);
    });
    console.log("assignedCustomers",assignedCustomers)
    customerStore.setAssignedCustomers(assignedCustomers.value);
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
