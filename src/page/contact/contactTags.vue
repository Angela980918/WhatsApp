<template>
    <div>
        <h1>录音示例</h1>
        <button @click="startRecording" :disabled="isRecording">开始录音</button>
        <button @click="stopRecording" :disabled="!isRecording">停止录音</button>
        <button @click="playRecording" :disabled="!audioUrl">播放录音</button>
        <button @click="downloadRecording" :disabled="!audioUrl">下载录音</button>

        <audio v-if="audioUrl" :src="audioUrl" controls></audio>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Recorderx from 'recorderx';

// 状态管理
const isRecording = ref(false); // 是否正在录音
const audioUrl = ref(''); // 录音文件的 URL
let recorder = null; // Recorderx 实例
let audioBlob = null; // 录音文件的 Blob 对象

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

// 开始录音
const startRecording = async () => {
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
        audioUrl.value = ''; // 清空之前的录音
        console.log('录音开始');
    } catch (error) {
        console.error('无法访问麦克风:', error);
    }
};

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
        audioUrl.value = URL.createObjectURL(wavBlob);
        console.log('录音停止', audioUrl.value);
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
const playRecording = () => {
    if (audioUrl.value) {
        const audio = new Audio(audioUrl.value);
        audio.play();
        console.log('播放录音');
    }
};

// 下载录音
const downloadRecording = () => {
    if (audioBlob) {
        const url = URL.createObjectURL(audioBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recording.wav'; // 下载文件名
        a.click();
        URL.revokeObjectURL(url);
        console.log('下载录音');
    }
};
</script>

<style>
button {
    margin: 5px;
}
</style>
