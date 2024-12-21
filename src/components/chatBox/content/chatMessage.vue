
<template>
    <div style="display: flex; height: 100%; flex-direction: column;">
        <TemplateList :currentPhone="currentPhone" ref="colTemp"  />
        <a-textarea name="messageContent" ref="textAreaRef"  v-model:value="contentTxt" placeholder="輸入內容" :rows="4" />
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <div>
                <a-tooltip>
                    <template #title>表情</template>
                    <SmileOutlined class="inputText" style="font-size: 20px; margin: 4px;" @click="showSmile" />
                </a-tooltip>
                <a-tooltip>
                    <template #title>快捷回復</template>
                    <MessageOutlined style="font-size: 20px; margin: 4px;" />
                </a-tooltip>
                <a-tooltip>
                    <template #title>上傳文檔</template>
                    <PaperClipOutlined style="font-size: 20px; margin: 4px;" />
                </a-tooltip>
                <a-tooltip>
                    <template #title>選擇產品/服務</template>
                    <ContainerOutlined style="font-size: 20px; margin: 4px;" />
                </a-tooltip>
                <a-tooltip>
                    <template #title>地理位置</template>
                    <EnvironmentOutlined style="font-size: 20px; margin: 4px;" />
                </a-tooltip>
                <a-tooltip>
                    <template #title>錄音</template>
                    <AudioOutlined style="font-size: 20px; margin: 4px;" />
                </a-tooltip>
                <a-tooltip>
                    <template #title>訊息模板</template>
                    <FileTextOutlined style="font-size: 20px; margin: 4px;" @click="handleSubmit" />
                </a-tooltip>
            </div>
            <div>
                <a-button @click="sendMessage" type="primary" shape="circle" :size="size">
                    <template #icon>
                        <SendOutlined />
                    </template>
                </a-button>
            </div>
        </div>

            <Picker v-if="showEmoji" class="emojiPicker" :data="emojiIndex" set="twitter" @select="selectEmoji" />

    </div>
<!--        <Picker :data="emojiIndex" set="twitter" @select="showEmoji" />-->
</template>

<script setup>
import {
    ContainerOutlined,
    SmileOutlined,
    MessageOutlined,
    PaperClipOutlined,
    FileTextOutlined,
    EnvironmentOutlined,
    AudioOutlined,
    BorderOutlined,
    SendOutlined

} from '@ant-design/icons-vue';
import data from "emoji-mart-vue-fast/data/all.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";
import * as ycloudApi from "@/api/ycloud/index.js";
import {computed, defineProps, ref} from "vue";
import {useCustomerStore} from "@/store/customerStore.js";
import {useChatStore} from "@/store/chatStore";
import { messageType } from '@/tools/wsconnect.js';
import TemplateList from "@/components/chatBox/content/message/TemplateList.vue";

const customerStore = useCustomerStore();
const chatStore = useChatStore();
const currentCustomerInfo = computed(() => customerStore.currentCustomerInfo);
const currentPhone = computed(() => chatStore.currentPhone);
const size = ref('large');
const contentTxt = ref('');
const showEmoji = ref(false);
const colTemp = ref(null)
let emojiIndex = new EmojiIndex(data);
const textAreaRef = ref(null);
function selectEmoji(emoji) {
    insertAtCursor(emoji.native);
}

function handleSubmit() {
    colTemp.value.controlTemp();
}

function insertAtCursor(text) {
    const textarea = textAreaRef.value;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    // 插入表情文本
    contentTxt.value =
        contentTxt.value.slice(0, startPos) +
        text +
        contentTxt.value.slice(endPos);
    console.log("contentTxt.value",contentTxt.value)
    // 更新光标位置
    textarea.focus();
    showSmile();
}

async function sendMessage() {

    const resultObj = await ycloudApi.messageApi.sendMessage({
        from: "+8613672967202",
        to: currentPhone.value,
        type: "text",
        message: contentTxt.value
    })
    const result = resultObj.data;
    console.log("发送消息",result)

    let message = {
        position: "outbound",
        id: result.id,
        status: result.status,
        type: result.type,
        time: result.createTime
    }

    if(result.type === 'text') {
        message.title = result.text.body;
    }else {
        message.link = result[result.type].link
        message.title = result[result.type].caption
    }

    contentTxt.value = "";
    chatStore.addMessage(message);
}

function showSmile() {
    console.log("8888888")
    showEmoji.value = !showEmoji.value
}

</script>

<style scoped>
.custom-input input {
    text-align: left; /* 左对齐 */
    font-size: 16px; /* 字体大小 */
    line-height: 1.2; /* 调整行高，确保文字从顶部开始 */
    padding: 8px 11px; /* 内部间距 */
}
.inputText {
    position: relative;
}
.emojiPicker {
    position: absolute;
    bottom: 200px;
}
</style>
