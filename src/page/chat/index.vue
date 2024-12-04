<template>
  <a-space direction="vertical" :style="{ width: '100%' }" :size="[0, 48]">
    <a-layout>
      <chat-box-left></chat-box-left>
      <a-layout>
        <a-layout-content :style="contentStyle">
          {{ currentChatId}}
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

const chatStore = useChatStore()

const currentChatId = computed(() => chatStore.currentChatId);


const headerStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  // height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#7dbcea',
};

const contentStyle: CSSProperties = {
  textAlign: 'center',
  minHeight: 600,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#108ee9',
};


const footerStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#7dbcea',
};
</script>

