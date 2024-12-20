<template>
    <div :style="{ width: '100%', height: '100%' }">
        <!-- 聊天框 -->
        <a-layout style="height: 100%; flex-direction: column;">
            <ImageView
                :imgUrl="imgUrl"
                :visiable="visiable"
                @handleChange="handleVisiable"
            />
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
                    <div v-for="item in data" >
                        <div>
                            <div :class="item.position === 'inbound' ? ['message-content'] : ['message-content right']">
                                <div style="display: flex;flex-direction: column-reverse;">
                                    <a-avatar style="margin-bottom: 10px;" size="large"
                                              src="https://randomuser.me/api/portraits/women/7.jpg"/>
                                </div>

                                <div :class="item.position === 'inbound' ? ['list-item-content'] : ['list-item-content content-right']">
                                    <div v-if="item.type === 'text'">
                                        <span>{{ item.title }}</span>
                                    </div>

                                    <div v-else-if="item.type === 'image'">
                                        <div style="position: relative;max-width: 350px;max-height: 350px;overflow: hidden">
                                            <img :src="item.link"
                                                 style="object-fit: cover;min-height: 220px;max-width: 100%;cursor: pointer;"
                                                 @click="handleVisiable(item.link)">
                                        </div>
                                        <span>{{ item.title }}</span>
                                    </div>

                                    <div v-else-if="item.type === 'video'">
                                        <div>
                                            <video ref="videoPlayer" width="100%" controls class="mt-2">
                                                <source :src="item.link" type="video/mp4">
                                            </video>
                                            <span>{{ item.title }}</span>
                                        </div>
                                    </div>

                                    <div v-else-if="item.type === 'document'">
                                        <div>
                                            <a :href="item.link"
                                               download
                                               target="_blank"
                                               style="display: flex; justify-content: center; font-size: 50px;width: 100%;padding: 15px; border-width: 1px; border-style: solid; border-radius: 10px; border-color: #0e0e0e0e;">

                                                <FilePdfOutlined style="color: red; cursor: pointer;"/>

                                            </a>
                                            <span>{{ item.title }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div :class="item.position === 'inbound' ? ['message-footer'] : ['message-footer', 'message-footer-right']">
                                <span>{{ item.time }}</span>
                                <span class="status-icon">
                                    <div v-if="item.status === 'delivered'">
                                        <CheckOutlined
                                            style="padding-left: 12px;padding-right: 12px;color: black;font-size: 14px"/>
                                    </div>
                                    <div v-else-if="item.status === 'read'">
                                        <CheckOutlined
                                            style="padding-left: 12px;padding-right: 12px;color: green;font-size: 14px"/>
                                    </div>
                                    <div v-else-if="item.status === 'failed'">
                                        <ExclamationCircleOutlined
                                            style="color: red;padding-left: 12px;padding-right: 12px;font-size: 14px"/>
                                    </div>
                                    <div v-else-if="item.status === 'sent' || 'accepted'">
                                        <LoadingOutlined style="color: black;padding-left: 12px;padding-right: 12px;font-size: 14px"/>
                                    </div>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </a-layout-content>

            <!-- 底部输入框 -->
            <a-layout-footer :style="footerStyle">
                <ChatMessage/>
            </a-layout-footer>
        </a-layout>
    </div>
</template>

<script lang="ts" setup>
import {
    computed,
    CSSProperties,
    h,
    nextTick,
    onBeforeMount,
    onBeforeUnmount,
    onMounted,
    onUpdated,
    ref,
    watch
} from 'vue';
import {useCustomerStore} from "@/store/customerStore";
import {
    FileSearchOutlined,
    TagOutlined,
    IdcardOutlined,
    ExclamationCircleOutlined,
    CheckOutlined,
    FilePdfOutlined,
    LoadingOutlined
} from '@ant-design/icons-vue';
import ChatMessage from "@/components/chatBox/content/chatMessage.vue";

import {useChatStore} from "@/store/chatStore";
import ImageView from "./message/ImageView.vue";

const emits = defineEmits(['setShowRight'])

// 获取 userStore 和 chatStore
const customerStore = useCustomerStore();
const assignedCustomers = computed(() => customerStore.assignedCustomers)

const chatStore = useChatStore();


const currentCustomerInfo = computed(() => customerStore.currentCustomerInfo)

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

const visiable = ref(false);
const imgUrl = ref("");

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
    type: string;
    status: string;
    link: string
}

// const data: DataItem[] = ref([
//     {
//         position: 'inbound',
//         title: 'Ant Design Title 1',
//         time: '2024-12/02 20:12:30',
//         type: 'text',
//     },
//     {
//         position: 'inbound',
//         title: 'Ant Design Title 2',
//         time: '2024-12/02 20:12:30',
//         type: 'text',
//     },
//     {
//         position: 'outbound',
//         title: 'Ant Design Title 3 Ant Design Title 3 Ant Design Title 3 Ant Design Title 3',
//         time: '2024-12/02 20:12:30',
//         status: "sent",
//         type: 'text',
//     },
//     {
//         position: 'outbound',
//         title: 'Ant Design Title 4',
//         time: '2024-12/02 20:12:30',
//         status: "failed",
//         type: 'text',
//     },
//     {
//         position: 'inbound',
//         title: 'Ant Design Title 2',
//         time: '2024-12/02 20:12:30',
//         type: 'text',
//     },
//     {
//         position: 'outbound',
//         title: 'Ant Design Title 2',
//         time: '2024-12/02 20:12:30',
//         status: "delivered",
//         type: 'text',
//     },
//     {
//         position: 'outbound',
//         title: 'Ant Design Title 4',
//         time: '2024-12/02 20:12:30',
//         status: "read",
//         type: 'text',
//     },
//     {
//         position: 'outbound',
//         title: 'Ant Design Title 4',
//         time: '2024-12/02 20:12:30',
//         status: "delivered",
//         type: 'text',
//     },
//     {
//         position: 'outbound',
//         link: "https://cos.jackycode.cn/29700.jpg",
//         title: 'imagetest 4',
//         time: '2024-12/02 20:12:30',
//         status: "delivered",
//         type: 'image',
//     },
//     {
//         position: 'outbound',
//         link: "https://reloan-old.s3.ap-east-1.amazonaws.com/sign.mp4",
//         title: 'videotest 4',
//         time: '2024-12/02 20:12:30',
//         status: "delivered",
//         type: 'video',
//     },
//     {
//         position: 'outbound',
//         link: "https://cos.jackycode.cn/29700.jpg",
//         title: 'documenttest 4',
//         time: '2024-12/02 20:12:30',
//         status: "delivered",
//         type: 'document',
//     },
//     {
//         position: 'inbound',
//         link: "https://cos.jackycode.cn/29700.jpg",
//         title: 'imagetest 4',
//         time: '2024-12/02 20:12:30',
//         status: "delivered",
//         type: 'image',
//     },
//     {
//         position: 'inbound',
//         link: "https://reloan-old.s3.ap-east-1.amazonaws.com/sign.mp4",
//         title: 'videotest 4',
//         time: '2024-12/02 20:12:30',
//         status: "delivered",
//         type: 'video',
//     },
//     {
//         position: 'inbound',
//         link: "https://cos.jackycode.cn/29700.jpg",
//         title: 'documenttest 4',
//         time: '2024-12/02 20:12:30',
//         status: "delivered",
//         type: 'document',
//     },
// ]);

const data = computed(() => {
    console.log("chatStore.chatMessages",chatStore.chatMessages)
    return chatStore.chatMessages
});
const currentPhone = computed(() => chatStore.currentPhone);


// const key = computed(() => {
//   return chatStore.currentPhone + '_' + '+8613672967202'
// });
// console.log("key", key);


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
const handleVisiable = (link) => {

    if (link !== undefined) {
        imgUrl.value = link;
    }
    console.log("link", link)
    visiable.value = !visiable.value;
}


// 在数据更新后自动滚动到底部
onMounted(async () => {
    scrollToBottom();

    window.addEventListener('beforeunload', function (){
        console.log("onBeforeMount triggered");
        const key = chatStore.currentPhone + "_" + "+8613672967202";
        localStorage.setItem(key, JSON.stringify([...data.value]))
        localStorage.setItem("test", "test")
    })
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
    flex: 0 0 calc(-383px + 100vh);
    flex-direction: column;
    overflow-y: auto;
}

.chatRoom {
    height: 100%;
}

.item {
    display: flex;
}

.right {
    /*flex-direction: row;*/
    flex-direction: row-reverse;
    justify-content: end;
}

.message-content {
    padding: 12px;
    color: #333;
    overflow-x: auto;
    /*background: hsla(0, 0%, 89.8%, .2);*/
    /*box-shadow: 0 1px 0 #e5e5e5;*/
    border-radius: 0 8px 8px 8px;
    font-size: 16px;
    line-height: 22px;
    display: flex;

}

.content-right {
    margin-left: 0px;
    margin-right: 10px;
}

.list-item-content {
    display: flex;
    width: unset;
    padding: 8px;
    border-radius: 8px;
    background: #ffffff;
    min-width: 200px;
    max-width: 50%;
    text-align: start;
    margin-left: 10px;

    span {
        font-size: 22px;
        margin-top: 10px;
    }
}

.message-footer {
    display: flex;
    flex-direction: row;
    padding: 0 12px 12px 12px;
    margin-left: 58px;
    height: 20px;
    align-items: center;
}

.message-footer-right {
    margin-left: 0px;
    margin-right: 58px;
    justify-content: end;
}

</style>
