<template>
  <!-- 標籤頁頭部 -->
  <a-space direction="vertical" style="width: 100%;">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1">
        <template #tab>
          <a-badge count="25">
            <span style="padding-right: 20px">
              <EyeOutlined/>
              已分配
            </span>
          </a-badge>
        </template>

        <!--    客户列表    -->
        <a-space  @click="handleItemClick(customer.id, customer.phoneNumber)"
                 direction="vertical" style="width: 100%;" v-for="customer in props.assignedCustomersData"
                 :key="customer.id">
          <chat-box-left-item :color="customer.color" :name="customer.name" :time="customer.time" :message="customer.message"
                              :badgeCount="customer.badgeCount"
                              :class="currentPhone == customer.phoneNumber?'chat-box-left-item-active':''"

          ></chat-box-left-item>
        </a-space>

      </a-tab-pane>
      <a-tab-pane key="2" force-render>
        <template #tab>
          <a-badge count="15">
            <span style="padding-right: 20px">
              <EyeInvisibleOutlined/>
              未分配
            </span>
          </a-badge>
        </template>
        <!--    客户列表    -->
        <a-space :class="{ 'chat-box-left-item-active': customer.isActive }" @click="handleItemClick(customer.id)"
                 direction="vertical" style="width: 100%;" v-for="(customer,index) in props.unassignedCustomersData"
                 :key="customer.id">
          <chat-box-left-item :color="customer.color"
                              :name="customer.name"
                              :time="customer.time" :message="customer.message"
                              :badgeCount="customer.badgeCount"
                              :class="currentCustomerId == customer.id?'chat-box-left-item-active':''"
          >
          </chat-box-left-item>
        </a-space>
      </a-tab-pane>
    </a-tabs>
  </a-space>
</template>


<script lang="ts" setup>
import {computed, onMounted, ref, defineEmits} from "vue";
import {EyeInvisibleOutlined, EyeOutlined} from '@ant-design/icons-vue';
import ChatBoxLeftItem from "@/components/chatBox/left/chatBox-Left-Item.vue";
import {useCustomerStore} from "@/store/customerStore";
import {useChatStore} from "@/store/chatStore";

const props = defineProps({
  assignedCustomersData: {
    type: Array
  },
  unassignedCustomersData: {
    type: Array
  }
})
const emits = defineEmits(['loadLocalMessage'])
const customerStore = useCustomerStore();
const chatStore = useChatStore();
const currentCustomerId = computed(()=> customerStore.currentUserId)
const currentPhone = computed(() => chatStore.currentPhone);

const activeKey = ref('1');

// 处理点击事件
const handleItemClick = (id: number, phoneNumber: string) => {
  const data = chatStore.chatMessages;
  const key = chatStore.currentPhone + "_" + "+8613672967202";
  localStorage.setItem(key, JSON.stringify(data));
  chatStore.clearChat();
  customerStore.setCurrentUser(id)
  chatStore.setCurrentChatId(id)
  chatStore.setCurrentPhone(phoneNumber)
  emits('loadLocalMessage', phoneNumber, "+8613672967202")
};

onMounted(() => {
  // 设置已分配和未分配客户
  // customerStore.setAssignedCustomers(props.assignedCustomersData);
  // customerStore.setUnassignedCustomers(props.unassignedCustomersData);
})

</script>

<style scoped>
.chat-box-left-item-active {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}
</style>
