<template>
    <div :style="
        {
            'flex-direction': props.direction === 'vertical' ? 'column' : 'row',
            'align-items': props.direction === 'vertical' ? 'flex-start' : 'center',
            'margin-top': props.direction === 'vertical' ? '10px' : '18px'
        }"
         class="selectCard"
    >
        <span :class="{
            'selectTitle': props.require
        }" v-if="props.title !== undefined">{{ props.title }}</span>

        <template v-if="props.type === 'search'">
            <a-input
                v-model:value="searchContents"
                allow-clear
                style="flex-grow: 1; width: 100%;"
                @change="handleChange"
            >
                <template #prefix><SearchOutlined /></template>
            </a-input>
        </template>

        <template v-else-if="props.type === 'select-common'">
            <a-select
                v-model:value="selectItem"
                @change="handleChange"
                style="flex-grow: 1; width: 100%"
                :options="selectOptions"
            ></a-select>
        </template>

        <template v-else-if="props.type === 'select-multiple'">
            <a-select
                v-model:value="selectItem"
                @change="handleChange"
                mode="multiple"
                placeholder="請選擇"
                style="flex-grow: 1; width: 100%"
                :options="selectOptions"
            ></a-select>
        </template>

        <template v-else-if="props.type === 'input-text'">
            <a-input
                v-model:value="inputContents"
                show-count
                @change="handleChange"
                :maxlength=props.maxTxt />
        </template>

        <template v-else-if="props.type === 'upload-file'">
            <a-upload
                v-model:file-list="selectItem"
                :before-upload="handleChange"
                :accept="uploadType"
            >
                <a-button>
                    <upload-outlined></upload-outlined>
                    選擇文件
                </a-button>
            </a-upload>
            <span style="color: #808695; font-size: 14px">{{uploadTxt()}}</span>


        </template>
    </div>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue';
import { SearchOutlined, UploadOutlined } from '@ant-design/icons-vue';
import Templates from "@/page/marketing/templates.vue";

const props = defineProps({
    direction: {
        type: String,
        default: "horizontal"
    },
    require: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ""
    },
    options: {
        type: Array,
        default: []
    },
    type: {
        type: String,
        default: "search"
    },
    selectItem: {
        type: Object,
        default: []
    },
    searchContents: {
        type: String,
        default: ""
    },
    inputContents: {
        type: String,
        default: ""
    },
    maxTxt: {
        type: String,
        default: undefined
    },
    uploadType: {
        type: String,
        default: 'image/*'
    }
});
const emits = defineEmits(['handleChange'])

const selectItem = ref(props.selectItem);
const selectOptions = ref(props.options);
const searchContents = ref(props.searchContents);
const inputContents = ref(props.inputContents);

const fileList = ref([]);
const uploadTxt = () => {
    if (props.uploadType === 'image/*') {
        return "(請選擇圖片)";
    }else if(props.uploadType === 'video/*') {
        return "(請選擇視頻)"
    }else if(props.uploadType === '.pdf') {
        return "(請上傳pdf附件)"
    }
}
const handleChange = (value) => {
    if(props.type === 'search') {
        emits('handleChange', searchContents.value)
    }else if(props.type === 'input-text') {
        emits('handleChange', inputContents.value)
    }else if(props.type === 'upload-file') {
        fileList.value.push(value);
        emits('handleChange', fileList.value)
        return false;
    }else {
        emits('handleChange', selectItem.value)
    }
};

</script>

<style scoped>
.selectCard {
    display: flex;
    padding: 0 12px;
    width: 30%; /* 可以根据需求修改宽度 */
}

.selectCard span {
    font-size: 16px;
    padding-right: 10px;
    margin-bottom: 12px;
    flex-grow: 0;  /* 让 span 自适应内容 */
    white-space: nowrap; /* 保证 span 内的文字不会换行 */
}

.selectTitle::before{
    content: '*';
    color: red;
    margin-right: 5px; /* 调整星号和文本之间的距离 */
}
</style>
