<template>
  <a-space direction="vertical" :style="{ width: '100%' }" :size="[0, 48]">
    <a-layout>
      <chat-box-left style="height: calc(100vh - 134.1px); display: flex; flex-direction: column;">
      </chat-box-left>
      <a-divider type="vertical" style="margin: unset;height: calc(100vh - 134.1px);"/>
      <a-layout>
        <a-layout-content :style="contentStyle">
          <chat-room>
          </chat-room>
        </a-layout-content>
        <a-layout-sider width="400" style="background: #fff; border-left: 1px solid #f0f0f0">
          <div style="padding: 16px;">右侧功能</div>
          <div style="padding: 12px;">更多信息或设置</div>
        </a-layout-sider>
      </a-layout>
    </a-layout>
  </a-space>
</template>
<script lang="ts" setup>
import {computed, CSSProperties} from 'vue';
import ChatBoxLeft from "@/components/chatBox/left/chatBox-Left.vue";

import {useChatStore} from "@/store/chatStore";
import ChatRoom from "@/components/chatBox/content/chatRoom.vue";

const chatStore = useChatStore()

const currentChatId = computed(() => chatStore.currentChatId);

const contentStyle: CSSProperties = {
  textAlign: 'center',
  minHeight: 600,
  lineHeight: '120px',
  color: '#000',
};

</script>

