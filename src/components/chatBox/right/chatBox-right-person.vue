<template>
    <div style="padding: 12px;">
        <div class="container">
            <div class="info">
                <div class="info-item">
                    <span>電話號碼</span>
                    <span>{{customerInfo.phoneNumber}}</span>
                </div>
                <div class="info-item">
                    <span>電郵</span>
                    <span>N/A</span>
                </div>
            </div>
            <div>
                <a-tooltip>
                    <EditOutlined />
                </a-tooltip>
            </div>
        </div>
    </div>
</template>

<script setup>
import {useChatStore} from "@/store/chatStore.js";
import {useCustomerStore} from "@/store/customerStore";
import {computed, watch} from "vue";
import {EditOutlined} from '@ant-design/icons-vue';

const chatStore = useChatStore();
const customerStore = useCustomerStore();

const customerInfo = computed(() => chatStore.currentCustomerInfo);

watch(() => chatStore.currentChatId, (newValue) => {
    // console.log("newValue",newValue)
})

</script>

<style scoped>
    .container {
        width: 100%;
        border-bottom:1px solid #F0F0F0;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
    .info {
        flex-direction: row;
        min-width: 80%;
        .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
        }
    }
</style>
