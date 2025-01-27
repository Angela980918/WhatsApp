
<template>
    <div style="display: flex; height: 100%; flex-direction: column;">
        <!--        模板消息选择-->
        <TemplateList  :currentPhone="currentPhone" ref="colTemp" v-show="showTemp"  />

        <!--        快捷回复-->
        <QuickMsg ref="quickRef" :showQuickList="true"/>

        <!--        输入文本信息-->
        <a-textarea @pressEnter="sendMessage()" name="messageContent" ref="textAreaRef"  v-model:value="contentTxt" placeholder="輸入內容" :rows="4" />

        <!--        选择的文件显示栏位-->
        <div v-if="messageType !== 'text'"
             style="margin-top: 10px; width: 100%; max-height: 56px; overflow: hidden; padding: 10px; border-width: 1px; border-radius: 10px; border-color: #EFEDF5; border-style: solid; background-color:#EFEDF5;">
            <div style="width: 100%; display: flex; align-items: center; position: relative; height: 40px; overflow: hidden;">

                <!-- 图片或文件图标 -->
                <img v-if="messageType === 'image'" :src="docTxt"
                     style="width: 40px; height: 40px; object-fit: contain; cursor: pointer;" />
                <FileTextFilled v-else style="color: #DCDCDC; cursor: pointer; font-size: 40px;"/>

                <!-- 文件名，flex-grow使其占用剩余空间 -->
                <span style="margin-left: 10px; font-size: 14px;">
            {{ getFileName() }}
        </span>

                <!-- 关闭图标，靠右对齐 -->
                <CloseCircleFilled class="closeBtn" @click="clearFile"/>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <div>
                <a-tooltip>
                    <template #title>表情</template>
                    <SmileOutlined class="inputText" style="font-size: 20px; margin: 4px;" @click="showSmile"  ref="smileIcon"/>
                </a-tooltip>
                <a-tooltip>
                    <template #title>快捷回復</template>
                    <MessageOutlined style="font-size: 20px; margin: 4px;" @click="showQuickMsg"/>
                </a-tooltip>
                <a-tooltip>
                    <template #title>上傳文檔</template>
                    <PaperClipOutlined style="font-size: 20px; margin: 4px;" @click="uploadDoc"/>
                    <input id="upload"
                           accept="image/jpeg,image/png,video/mp4,application/*"
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
                <a-button @click="sendMessage" type="primary" shape="circle" :size="size">
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
    AudioOutlined,
    CloseCircleFilled,
    ContainerOutlined,
    EnvironmentOutlined,
    FileTextFilled,
    FileTextOutlined,
    MessageOutlined,
    PaperClipOutlined,
    SendOutlined,
    SmileOutlined
} from '@ant-design/icons-vue';
import data from "emoji-mart-vue-fast/data/all.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import {EmojiIndex, Picker} from "emoji-mart-vue-fast/src";
import * as ycloudApi from "@/api/ycloud/index.js";
import {cosApi} from "@/api/whatsapp/index.js";
import {computed, ref} from "vue";
import {useCustomerStore} from "@/store/customerStore.js";
import {useChatStore} from "@/store/chatStore";
import {messageType} from '@/tools';
import {message} from "ant-design-vue";
import TemplateList from "@/components/chatBox/content/message/TemplateList.vue";
import QuickMsg from "@/components/contact/QuickMsg.vue";

const customerStore = useCustomerStore();
const chatStore = useChatStore();
const currentCustomerInfo = computed(() => chatStore.currentCustomerInfo);
const currentPhone = computed(() => chatStore.currentPhone);

const size = ref('large');
const contentTxt = ref('');
const docTxt = ref(null);
const messageType = ref('text');

const quickRef = ref(null);
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

    if(fileContent.size > 100 * 1024 * 1024) {
        // console.log("fileContent",fileContent)
        message.error("文件大小应小于100MB");
        return
    }

    if(type === "application") {
        type = "document"
    }

    if (files && files.length > 0) {
        const response = await cosApi.uploadFile(fileContent);  // 上传文件

        docTxt.value = response;
        messageType.value = type;
        // sendMessage(type)

    }
};

function getFileName() {
    return  docTxt.value.split('/').pop();
}

function clearFile() {
    messageType.value = 'text';
    docTxt.value = null;
}

function selectEmoji(emoji) {
    insertAtCursor(emoji.native);
}

function handleSubmit() {
    // showTemp.value = !showTemp.value
    colTemp.value.controlTemp();
}

function showQuickMsg() {
    quickRef.value.setOpen()
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
async function sendMessage() {
    console.log("docTxt.value", docTxt.value)
    let data = {
        from: "+8613672967202",
        to: currentPhone.value,
        type: 'text',
        message: contentTxt.value
    };
    if(docTxt.value !== null) {
        data.type = messageType.value;
        data.link = docTxt.value;
    }

    const result = await ycloudApi.messageApi.sendMessage(data)
    //
    let message = {
        direction: "outbound",
        _id: result.id,
        status: result.status,
        type: result.type,
        deliverTime: result.createTime,
        content: {}
    }
    if(result.type === 'text') {
        message.content.body = result.text.body;
    }else {
        message.content.link = result[result.type].link
        const url = message.content.link;
        // message.content.filename = fileExtension;
        message.fileExtension = url.split('.').pop();
        message.content.caption = result[result.type].caption;
    }
    //
    contentTxt.value = "";
    messageType.value = "text";
    docTxt.value = null;
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
    if (smileIcon.value) {
        const rect = smileIcon.value.getBoundingClientRect(); // 获取图标的位置信息

        const pickerHeight = 480; // Picker的高度
        const windowHeight = window.innerHeight;
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

.closeBtn {
    color: #B5B5B5;
    cursor: pointer;
    font-size: 30px;
    margin-left: auto;
}
.closeBtn:hover {
    color: #7B68EE
}
</style>
