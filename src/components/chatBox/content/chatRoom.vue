<template>
  <div :style="{ width: '100%', height: '100%' }">
    <!-- 聊天框 -->
    <a-layout style="height: 100%; flex-direction: column;">
      <!-- 头部：聊天标题或信息 -->
      <a-layout-header :style="headerStyle">
        <a-flex style="height: 100%" justify="space-between" align="center">
          <span>{{ currentCustomerInfo.nickname }}</span>
          <a-space size="middle">
            <a-tooltip placement="top">
              <template #title>
                <span>添加會話標簽</span>
              </template>
              <a-button :icon="h(TagOutlined)"></a-button>
            </a-tooltip>

            <a-tooltip placement="top">
              <template #title>
                <span>搜索聊天記錄</span>
              </template>
              <a-button :icon="h(FileSearchOutlined)"></a-button>
            </a-tooltip>

            <a-button type="primary">結束會話</a-button>

            <a-tooltip placement="top">
                <template #title>
                    <span>顯示更多</span>
                </template>
                <a-button :icon="h(IdcardOutlined)" @click="emits('setShowRight')"></a-button>
            </a-tooltip>
          </a-space>
        </a-flex>
      </a-layout-header>

      <!-- 中间内容区域：显示聊天记录，可滚动 -->
      <a-layout-content class="chatroom22" ref="chatRoom26" :style="contentStyle" style="width: 100%;">
        <div class="chatRoom" ref="chatRoom">
          <a-list :split="false" item-layout="horizontal" :data-source="data">
            <template #renderItem="{ item }">
              <a-list-item v-if="item.position == 'left'" class="list-item-left">
                <a-space size="middle" align="end">
                  <a-avatar size="large" src="https://randomuser.me/api/portraits/women/7.jpg"/>
                  <a-list-item-meta class="list-item-content" :description="item.time">
                    <template #title>
                      <span>{{ item.title }}</span>
                    </template>
                  </a-list-item-meta>
                </a-space>
              </a-list-item>

              <a-list-item v-else class="list-item-right">
                <a-space size="middle" align="end">
                  <a-list-item-meta class="list-item-content" :description="item.time">
                    <template #title>
                      <span>{{ item.title }}</span>
                    </template>
                  </a-list-item-meta>
                  <a-avatar size="large" src="https://randomuser.me/api/portraits/women/7.jpg"/>
                </a-space>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </a-layout-content>

      <!-- 底部输入框 -->
      <a-layout-footer :style="footerStyle">
<!--        <a-input v-model="message" placeholder="输入消息..." :style="inputStyle" @keydown.enter="sendMessage"/>-->
<!--        <a-button type="primary" @click="sendMess">发送</a-button>-->
<!--          <WASelect direction="vertical" type="editor" :inputContents="valueHtml"-->
<!--                    @handleChange="htmlChange"/>-->
          <ChatMessage @customer="currentCustomerInfo.phoneNumber"/>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts" setup>
import {computed, CSSProperties, h, nextTick, onMounted, onUpdated, ref, watch} from 'vue';
import {useCustomerStore} from "@/store/customerStore";
import {FileSearchOutlined, TagOutlined, IdcardOutlined} from '@ant-design/icons-vue';
import ChatMessage from "@/components/chatBox/content/chatMessage.vue";
import wsconnect from "../../../tools/wsconnect.js";
import {useChatStore} from "@/store/chatStore";

const emits = defineEmits(['setShowRight'])

// 获取 userStore 和 chatStore
const customerStore = useCustomerStore();
wsconnect.createConnect();
const chatStore = useChatStore();

// customerStore.createConnect();

function sendMess() {
    // customerStore.sendMessage("test");
  wsconnect.sendMessage("449711484896804","test00001");
}


const currentCustomerInfo = computed(() => {
  // 如果 currentCustomerInfo 是空对象，则返回 customers 中的第一个客户信息
  return customerStore.currentCustomerInfo && Object.keys(customerStore.currentCustomerInfo).length > 0
      ? customerStore.currentCustomerInfo
      : customerStore.assignedCustomers[0] || {};
})

watch(() => customerStore.currentUserId, (newUserId) => {
  console.log('newUserId', newUserId)
  const user = customerStore.assignedCustomers.find(user => user.id === newUserId) ||
      customerStore.unassignedCustomers.find(user => user.id === newUserId);
  console.log('user', user);
  if (user) {
    customerStore.currentCustomerInfo = user;
    console.log(customerStore.currentCustomerInfo)
  } else {
    console.warn(`未找到 ID 为 ${newUserId} 的用户。`);
    // 处理未找到用户的情况
  }
})

// 模拟数据
const customers = ref([
  {id: 1, name: 'John'},
  {id: 2, name: 'Alice'},
  {id: 3, name: 'Bob'}
]);
const currentChatUser = ref(null);

interface DataItem {
  title: string;
  position: string;
  time: string;
}

const data: DataItem[] = ref([
  {
    position: 'left',
    title: 'Ant Design Title 1',
    time: '2024-12/02 20:12:30'
  },
  {
    position: 'left',
    title: 'Ant Design Title 2',
    time: '2024-12/02 20:12:30'

  },
  {
    position: 'right',
    title: 'Ant Design Title 3 Ant Design Title 3 Ant Design Title 3 Ant Design Title 3',
    time: '2024-12/02 20:12:30'
  },
  {
    position: 'right',
    title: 'Ant Design Title 4',
    time: '2024-12/02 20:12:30'
  },
  {
    position: 'left',
    title: 'Ant Design Title 2',
    time: '2024-12/02 20:12:30'

  },
  {
    position: 'left',
    title: 'Ant Design Title 2',
    time: '2024-12/02 20:12:30'

  },
  {
    position: 'right',
    title: 'Ant Design Title 4',
    time: '2024-12/02 20:12:30'
  }, {
    position: 'right',
    title: 'Ant Design Title 4',
    time: '2024-12/02 20:12:30'
  },
]);

watch(chatStore.chatMessages, (newValue) => {
    console.log("newValue",newValue);
    data.value = [...data.value, ...newValue]
})

const message = ref('');

// 选择客户并更新当前聊天用户
const selectCustomer = (customer) => {
  currentChatUser.value = customer;
  // 加载该客户的聊天记录
  loadMessages(customer.id);
};

// 模拟加载消息
const loadMessages = (customerId) => {
  // 这里你可以根据客户 ID 调用接口加载聊天记录
  data.value = [
    {user: 'Me', text: `Hello ${customerId}!`},
    {user: 'Alice', text: 'How are you?'}
  ];
};

// 发送消息
const sendMessage = () => {
  data.value.push({user: 'Me', text: message.value});
  message.value = '';
  scrollToBottom()
};

// 获取消息的样式（左侧或右侧）
const getMessageStyle = (message) => {
  return message.user === 'Me'
      ? {
        textAlign: 'right',
        backgroundColor: '#d1e7dd',
        padding: '5px 10px',
        borderRadius: '10px',
        marginBottom: '10px'
      }
      : {
        textAlign: 'left',
        backgroundColor: '#f8d7da',
        padding: '5px 10px',
        borderRadius: '10px',
        marginBottom: '10px'
      };
};

// 样式
const headerStyle = {
  backgroundColor: '#FFFFFF',
  color: '#000',
  textAlign: 'left',
  fontWeight: 'bold',
};

const contentStyle = {
  padding: '20px',
  backgroundColor: '#f0f0f0',
};

const siderStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  overflowY: "auto"

}

const footerStyle = {
  padding: '10px 20px',
  backgroundColor: '#fff',
  borderTop: '1px solid #ddd',
  textAlign: 'center',
  flex: 1
};

// 滚动到最底部的函数
const chatRoom = ref(null);
const chatRoom26 = ref(null);
const scrollToBottom = () => {
  nextTick(() => {
    const chatRoomElement = chatRoom26.value ? chatRoom26.value.$el : null;
    if (chatRoomElement) {
      console.log('scrollHeight:', chatRoomElement.scrollHeight); // 获取 scrollHeight
      chatRoomElement.scrollTop = chatRoomElement.scrollHeight; // 设置 scrollTop
    }
  });
};

// const handleScroll = (event) => {
//   console.log('chatRoom22.value.scrollHeight', chatRoom22.value.scrollHeight)
//   chatRoom22.value.scrollTop = chatRoom22.value.scrollHeight
//   console.log('chatRoom22.value.scrollTop', chatRoom22.value.scrollTop)
// };

// 在数据更新后自动滚动到底部
onMounted(async () => {
  scrollToBottom();
});
//
onUpdated(async () => {
  scrollToBottom();
});
</script>

<style scoped>
.chatroom22 {
  text-align: center;
  height: 100%;
  flex: 0 0 calc(-459px + 100vh);
  flex-direction: column;
  overflow-y: auto;
}

.chatRoom {
  height: 100%;
}

.list-item-right {
  text-align: end;
  justify-self: end;
}

.list-item-left {
  text-align: start;
  justify-self: start;
}

.list-item-content {
  flex: unset;
  width: unset;
  padding: 8px;
  border-radius: 8px;
  background: #ffffff;
  min-width: 200px;
  text-align: start;
}

</style>
