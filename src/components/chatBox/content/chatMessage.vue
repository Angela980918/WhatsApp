
<template>
    <div style="display: flex; height: 100%; flex-direction: column;">
<!--        模板消息选择-->
        <TemplateList  :currentPhone="currentPhone" ref="colTemp" v-show="showTemp"  />

        <a-textarea name="messageContent" ref="textAreaRef"  v-model:value="contentTxt" placeholder="輸入內容" :rows="4" />
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <div>
                <a-tooltip>
                    <template #title>表情</template>
                    <SmileOutlined class="inputText" style="font-size: 20px; margin: 4px;" @click="showSmile"  ref="smileIcon"/>
                </a-tooltip>
                <a-tooltip>
                    <template #title>快捷回復</template>
                    <MessageOutlined style="font-size: 20px; margin: 4px;" />
                </a-tooltip>
                <a-tooltip>
                    <template #title>上傳文檔</template>
                    <PaperClipOutlined style="font-size: 20px; margin: 4px;" @click="uploadDoc"/>
                    <input id="upload"
                           accept="image/jpeg,image/png,video/mp4,application/pdf"
                           ref="fileInput" style="display: none" type="file" @change="sendDocMessage"/>
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
                <a-button @click="sendMessage(`type`)" type="primary" shape="circle" :size="size">
                    <template #icon>
                        <SendOutlined />
                    </template>
                </a-button>
            </div>
        </div>

        <!-- 蒙版和表情Picker -->
        <div v-if="showEmoji" class="emoji-mask" @click="showSmile">
            <div class="emoji-picker-container" @click.stop :style="pickerStyle">
                <Picker :data="emojiIndex" set="twitter" @select="selectEmoji" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    ContainerOutlined,
    SmileOutlined,
    MessageOutlined,
    PaperClipOutlined,
    FileTextOutlined,
    EnvironmentOutlined,
    AudioOutlined,
    SendOutlined

} from '@ant-design/icons-vue';
import data from "emoji-mart-vue-fast/data/all.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";
import * as ycloudApi from "@/api/ycloud/index.js";
import {cosApi} from "@/api/whatsapp/index.js";
import {computed, defineProps, ref} from "vue";
import {useCustomerStore} from "@/store/customerStore.js";
import {useChatStore} from "@/store/chatStore";
import { messageType } from '@/tools';
import {message} from "ant-design-vue";
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
const fileInput = ref<HTMLInputElement | null>(null);
const smileIcon = ref(null);
const showTemp = ref(false);
const pickerStyle = ref({ top: '0', left: '0' }); // Picker的位置

const uploadDoc = () => {
    fileInput.value?.click();
};
// 触发上传文件
const sendDocMessage = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    let type = files[0].type.split('/')[0];
    let fileContent = files[0];

    if(fileContent.size <= 100 * 1024 * 1024) {
        message.error("文件大小应小于100MB");
    }

    if(type === "application") {
        type = "document"
    }

    if (files && files.length > 0) {
        const response = await cosApi.uploadFile(fileContent);  // 上传文件
        contentTxt.value = response;
        sendMessage(type)
    }
};

function selectEmoji(emoji) {
    insertAtCursor(emoji.native);
}

function handleSubmit() {
    // showTemp.value = !showTemp.value
    colTemp.value.controlTemp();
}

// 表情插入文本
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
    // console.log("contentTxt.value",contentTxt.value)
    // 更新光标位置
    textarea.focus();
    showSmile();
}

// 发送消息
async function sendMessage(type) {

    const result = await ycloudApi.messageApi.sendMessage({
        from: "+8613672967202",
        to: currentPhone.value,
        type: type,
        message: contentTxt.value
    })
    // const result = resultObj.data;
    // console.log("")
    let message = {
        position: "outbound",
        id: result.id,
        status: result.status,
        type: result.type,
        time: result.createTime
    }
    console.log("message",message)
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
    showEmoji.value = !showEmoji.value
    if (showEmoji.value) {
        setPickerPosition();
    }
}

// 表情模板位置计算
const setPickerPosition = () => {
    console.log("smileIcon.value",smileIcon.value.$el)
    if (smileIcon.value) {
        const rect = smileIcon.value.getBoundingClientRect(); // 获取图标的位置信息

        const pickerHeight = 480; // Picker的高度
        const windowHeight = window.innerHeight;
        console.log("rect", rect)
        if (rect.top < pickerHeight) {

            pickerStyle.value = {
                top: `${rect.bottom}px`,
                left: `${rect.left}px`,
            };
        } else {

            pickerStyle.value = {
                top: `${rect.top - pickerHeight}px`,
                left: `${rect.left}px`,
            };
        }
    }
};

</script>

<style scoped>
.custom-input input {
    text-align: left;
    font-size: 16px;
    line-height: 1.2;
    padding: 8px 11px;
}
.inputText {
    position: relative;
}

.emoji-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    z-index: 1000;
}

.emoji-picker-container {
    position: absolute;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
