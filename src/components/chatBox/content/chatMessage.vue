
<template>
    <div style="display: flex; height: 100%; flex-direction: column;">

        <!-- 录音蒙版 v-if="isRecording"-->
        <div class="overlay" v-if="isRecording" >
            <div class="icon-container" @click="stopRecording">
                <AudioMutedOutlined style="font-size: 35px" />
            </div>
        </div>

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
                    <AudioOutlined style="font-size: 20px; margin: 4px;" @click="audioStart"/>
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
    SmileOutlined,
    AudioMutedOutlined
} from '@ant-design/icons-vue';
import data from "emoji-mart-vue-fast/data/all.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import {EmojiIndex, Picker} from "emoji-mart-vue-fast/src";
import * as ycloudApi from "@/api/ycloud/index.js";
import {cosApi} from "@/api/whatsapp/index.js";
import {computed, nextTick, ref} from "vue";
import {useCustomerStore} from "@/store/customerStore.js";
import {useChatStore} from "@/store/chatStore";
import {messageType} from '@/tools';
import {message} from "ant-design-vue";
import TemplateList from "@/components/chatBox/content/message/TemplateList.vue";
import QuickMsg from "@/components/contact/QuickMsg.vue";
import Recorderx from 'recorderx';

// 语音录制
const isRecording = ref(false); // 是否正在录音
const audioUrl = ref(''); // 录音文件的 URL
let recorder = null; // Recorderx 实例
let audioBlob = null; // 录音文件的 Blob 对象

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

// 插入表情到光标位置
const insertAtCursor = (text) => {
    const textarea = textAreaRef.value?.resizableTextArea?.textArea;
    if (!textarea) return;

    const startPos = textarea.selectionStart; // 获取光标起始位置
    const endPos = textarea.selectionEnd; // 获取光标结束位置
    console.log("startPos,endPos", startPos,endPos)
    // 插入表情文本
    contentTxt.value =
        contentTxt.value.slice(0, startPos) +
        text +
        contentTxt.value.slice(endPos);

    // 更新光标位置
    nextTick(() => {
        textarea.focus();
        textarea.setSelectionRange(startPos + text.length, startPos + text.length);
        showSmile();
    });
};

// 发送消息
async function sendMessage() {
    // console.log("docTxt.value", docTxt.value)
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

// 语音录制方法
const getUserMedia = (constraints) => {
    if (navigator.mediaDevices?.getUserMedia) {
        return navigator.mediaDevices.getUserMedia(constraints);
    } else if (navigator.getUserMedia) {
        return new Promise((resolve, reject) => {
            navigator.getUserMedia(constraints, resolve, reject);
        });
    } else {
        return Promise.reject(new Error('当前浏览器不支持 getUserMedia'));
    }
};

const audioStart = async () => {
    try {
        // 获取麦克风权限
        const stream = await getUserMedia({ audio: true });

        // 初始化 Recorderx
        recorder = new Recorderx({
            sampleRate: 16000, // 采样率
            bufferSize: 4096, // 缓冲区大小
        });

        // 开始录音
        recorder.start(stream);
        isRecording.value = true;
        audioUrl.value = '';
        console.log('录音开始');
    } catch (error) {
        console.error('无法访问麦克风:', error);
    }
}

// 停止录音
const stopRecording = () => {
    if (recorder) {
        recorder.pause(); // 停止录音
        isRecording.value = false;

        // 获取录音文件的 Blob 对象
        audioBlob = recorder.getRecord();
        console.log("audioBlob", audioBlob)
        // 生成录音文件的 URL
        const wavBlob = encodeWAV(audioBlob, 16000);
        console.log('录音停止wavBlob', wavBlob);
        audioUrl.value = URL.createObjectURL(wavBlob);
        console.log('录音停止', audioUrl.value);

        // 将 Float32Array 转换为 WAV 格式或其他格式
        const FloatToBlob = new Blob([audioBlob], { type: 'audio/wav' }); // 或者根据你的实际格式使用不同的类型
        // 创建 File 对象
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioFile);
    }
};

const encodeWAV = (samples, sampleRate) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    // WAV 头部
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);

    // PCM 数据
    floatTo16BitPCM(view, 44, samples);

    return new Blob([buffer], { type: 'audio/wav' });
};


/**
 * 将 Float32Array 转换成 16-bit PCM 数据
 */
const floatTo16BitPCM = (view, offset, input) => {
    for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i])); // 限制范围
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
};

/**
 * 写入字符串到 DataView
 */
const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
};

// 播放录音
// const playRecording = () => {
//     if (audioUrl.value) {
//         const audio = new Audio(audioUrl.value);
//         audio.play();
//         console.log('播放录音');
//     }
// };

// 下载录音
// const downloadRecording = () => {
//     if (audioBlob) {
//         const url = URL.createObjectURL(audioBlob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'recording.wav'; // 下载文件名
//         a.click();
//         URL.revokeObjectURL(url);
//         console.log('下载录音');
//     }
// };

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
.overlay {
    position: fixed; /* 固定在屏幕上 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
    z-index: 1000; /* 确保蒙版显示在最前面 */
    display: flex;
    justify-content: center; /* 居中显示 */
    align-items: center; /* 居中显示 */
}

.icon-container {
    width: 100px; /* 圆形的宽度 */
    height: 100px; /* 圆形的高度 */
    background-color: #ffffff; /* 背景为白色 */
    display: flex;
    justify-content: center; /* 图标居中 */
    align-items: center; /* 图标垂直居中 */
    border-radius: 50%; /* 设置圆形 */
}
</style>
