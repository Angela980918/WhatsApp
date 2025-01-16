<template>
  <div class="rightTab">
    <div class="headerCard">
      <a-avatar style="margin-right: 12px" size="large" src="https://randomuser.me/api/portraits/women/7.jpg"/>
      <div class="sampleInfo">
        <span>關於 {{ currentCustomerInfo.name }}</span>
        <span>創建時間：2024/12/06</span>
      </div>
    </div>
    <div class="remarkCard">
      <div class="rmarkMain">
        <span>備註</span>
        <a-tooltip>
          <PlusCircleOutlined class="inputText" style="font-size: 16px; margin: 4px;color: #535bf2"/>
        </a-tooltip>
      </div>
      <span class="tip">您可以為該客戶添加任何備註</span>
    </div>

    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="狀態清單">
        <chat-box-right-status/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="個人資料" force-render>
        <chat-box-right-person/>
      </a-tab-pane>
      <a-tab-pane key="3" tab="檔案">
        <chat-box-right-file/>
      </a-tab-pane>
      <a-tab-pane key="4" tab="圖片">
        <chat-box-right-image/>
      </a-tab-pane>
      <a-tab-pane key="5" tab="提醒">
        <chat-box-right-tips/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import ChatBoxRightStatus from "@/components/chatBox/right/chatBox-right-status.vue";
import ChatBoxRightPerson from "@/components/chatBox/right/chatBox-right-person.vue";
import ChatBoxRightFile from "@/components/chatBox/right/chatBox-right-file.vue";
import ChatBoxRightImage from "@/components/chatBox/right/chatBox-right-image.vue";
import ChatBoxRightTips from "@/components/chatBox/right/chatBox-right-tips.vue"

import {useCustomerStore} from "@/store/customerStore.js";
import {useChatStore} from "@/store/chatStore.js";
import {PlusCircleOutlined} from "@ant-design/icons-vue";
import {storeToRefs} from "pinia";
import {computed, onMounted, ref} from "vue";

const activeKey = ref('1');
const customerStore = useCustomerStore();
const chatStore = useChatStore();
const currentCustomerInfo = computed(() => {
  // 如果 currentCustomerInfo 是空对象，则返回 customers 中的第一个客户信息
  return chatStore.currentCustomerInfo && Object.keys(chatStore.currentCustomerInfo).length > 0
      ? chatStore.currentCustomerInfo
      : customerStore.assignedCustomers[0] || {};
});

</script>

<style scoped>
.rightTab {
  padding: 16px;

  .headerCard {
    display: flex;
    flex-direction: row;

    .sampleInfo {
      display: flex;
      flex-direction: column;
    }
  }

  .remarkCard {
    border-radius: 4px;
    background-color: #edfafc;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 16px;
    margin-top: 16px;

    .rmarkMain {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
    }

    .tip {
      color: #b3b3b3;
      font-size: 14px;
      margin-top: 8px;
    }
  }
}

</style>
