<template>
  <!-- 標籤頁頭部 -->
  <a-space direction="vertical" style="width: 100%;">
<!--    <a-tabs v-model:activeKey="activeKey">-->
<!--      <a-tab-pane key="1">-->
<!--        <template #tab>-->
<!--          <a-badge :count="assCount">-->
<!--            <span style="padding-right: 20px">-->
<!--              <EyeOutlined/>-->
<!--              已分配-->
<!--            </span>-->
<!--          </a-badge>-->
<!--        </template>-->

<!--        &lt;!&ndash;    客户列表    &ndash;&gt;-->
<!--        <a-space  @click="handleItemClick(customer.id, customer.phoneNumber)"-->
<!--                 direction="vertical" style="width: 100%;" v-for="customer in props.assignedCustomersData"-->
<!--                 :key="customer.id">-->
<!--          <chat-box-left-item :color="customer.color" :name="customer.name" :time="customer.time" :message="customer.message"-->
<!--                              :badgeCount="customer.badgeCount"-->
<!--                              :class="currentChatId == customer.id?'chat-box-left-item-active':''"-->

<!--          ></chat-box-left-item>-->
<!--        </a-space>-->

<!--      </a-tab-pane>-->
<!--      <a-tab-pane key="2" force-render>-->
<!--        <template #tab>-->
<!--          <a-badge :count="unAssCount">-->
<!--            <span style="padding-right: 20px">-->
<!--              <EyeInvisibleOutlined/>-->
<!--              未分配-->
<!--            </span>-->
<!--          </a-badge>-->
<!--        </template>-->
<!--        &lt;!&ndash;    客户列表    &ndash;&gt;-->
<!--        <a-space :class="{ 'chat-box-left-item-active': customer.isActive }" @click="handleItemClick(customer.id)"-->
<!--                 direction="vertical" style="width: 100%;" v-for="(customer,index) in props.unassignedCustomersData"-->
<!--                 :key="customer.id">-->
<!--          <chat-box-left-item :color="customer.color"-->
<!--                              :name="customer.name"-->
<!--                              :time="customer.time" :message="customer.message"-->
<!--                              :badgeCount="customer.badgeCount"-->
<!--                              :class="currentChatId == customer.id?'chat-box-left-item-active':''"-->
<!--          >-->
<!--          </chat-box-left-item>-->
<!--        </a-space>-->
<!--      </a-tab-pane>-->
<!--    </a-tabs>-->
      <div style="width: 100%; color: #1a1a1a; padding: 10px 0 10px 0; font-size: 16px">
          <UserOutlined />
        <span>客户列表</span>
      </div>
      <!--    客户列表    -->
      <a-space  @click="handleItemClick(customer.id, customer.phoneNumber)"
                direction="vertical" style="width: 100%;" v-for="customer in userData"
                :key="customer.id">
          <chat-box-left-item :color="customer.color" :name="customer.name" :time="customer.time" :message="customer.message"
                              :badgeCount="customer.badgeCount"
                              style="color: #1a1a1a"
                              :class="currentChatId == customer.id?'chat-box-left-item-active':''"

          ></chat-box-left-item>
      </a-space>
  </a-space>
</template>


<script lang="ts" setup>
import {computed, onMounted, ref, defineEmits, watch} from "vue";
import {UserOutlined} from '@ant-design/icons-vue';

import ChatBoxLeftItem from "@/components/chatBox/left/chatBox-Left-Item.vue";
import {useCustomerStore} from "@/store/customerStore";
import {useChatStore} from "@/store/chatStore";


const props = defineProps({
  assignedCustomersData: {
    type: Array
  },
})
const userData = ref(props.assignedCustomersData);

const emits = defineEmits(['loadChatMessage'])
const customerStore = useCustomerStore();
const chatStore = useChatStore();
// const currentCustomerId = computed(()=> customerStore.currentUserId)
const currentChatId = computed(() => chatStore.currentChatId);

const assCount = ref(0);
// const unAssCount = ref(0);

const activeKey = ref('1');

// 处理点击事件
const handleItemClick = (id: number, phoneNumber: string) => {
  props.assignedCustomersData.find(item => {
      if(item.id === id) {
          chatStore.setCurrentUserInfo(item);
      }
  })
  emits('loadChatMessage', phoneNumber, id)
};

watch(() => customerStore.searchWord, (newValue) => {
    if(newValue === "") {
        userData.value = props.assignedCustomersData;
    }else {
        let list = [];
        props.assignedCustomersData.map(item => {
            if(item.name.indexOf(newValue) !== -1 || item.phoneNumber.indexOf(newValue) !== -1) {
                list.push(item);
            }
        })
        userData.value = list;
    }
});

watch(() => props.assignedCustomersData, (newValue) => {
    userData.value = newValue;
}, {deep: true})

watch(() => customerStore.assignedCustomers, (newValue) => {
    // console.log("newValuenewValue",newValue)
    let count = 0;
    newValue.map(item => {
        count += item.badgeCount ?? 0
    })
    assCount.value = count;
})

// watch(() => customerStore.unassignedCustomers, (newValue) => {
//     // console.log("newValuenewValue",newValue)
//     let count = 0;
//     newValue.map(item => {
//         count += item.badgeCount ?? 0
//     })
//     unAssCount.value = count;
// })

</script>

<style scoped>
.chat-box-left-item-active {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}
</style>
