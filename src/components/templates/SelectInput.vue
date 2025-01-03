<template>
  <template v-if="props.type === 'input-text'">
    <a-input :disabled="props.disabled" :maxlength="props.maxTxt" showCount v-model:value="inputContents"
             @change="handleChange"></a-input>
  </template>

  <template v-else-if="props.type === 'select-common'">
    <a-select
        :name="props.name"
        v-model:value="props.selectValue"
        :options="props.selectOptions"
        :disabled="props.disabled"
        @change="handleChange"
    ></a-select>
  </template>

  <template v-else-if="props.type === 'upload-file'">
    <a-upload
        v-model:file-list="fileList"
        list-type="picture"
        :max-count="props.uploadMaxCount"
        :accept="fileType"
        :custom-request="customUpload"
        :on-remove="handleRemove"
        @change="handleChange"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        {{ uploadTxt(props.uploadType) }}
      </a-button>
    </a-upload>
  </template>

  <template v-else-if="props.type === 'editor'">
    <div style="border: 1px solid #ccc; width: 100%; max-width: 100%; box-sizing: border-box;">
      <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          mode="default"
      />
      <Editor
          style="height: 300px;overflow-y: hidden;width: 100%;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;white-space: pre-wrap;box-sizing: border-box"
          v-model="valueHtml"
          :defaultConfig="editorConfig"
          @onChange="handleChange"
          @onCreated="handleCreated"
      />
    </div>
  </template>
</template>

<script setup>
import {defineEmits, defineProps, onBeforeMount, onBeforeUnmount, ref, shallowRef, watch} from "vue";
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import {UploadOutlined} from "@ant-design/icons-vue";
import {message} from 'ant-design-vue';
import {cosApi} from "@/api/whatsapp/index.js";
import {useTempStore} from "@/store/useTempStore.js";


const props = defineProps({
  // 名稱
  name: {
    type: String,
    default: ""
  },
  // 類型
  type: {
    type: String,
    default: ""
  },
  // 輸入字數限制
  maxTxt: {
    type: Number,
    default: 512
  },
  // 當前選擇
  selectValue: {
    type: String,
    default: ""
  },
  // 可選項
  selectOptions: {
    type: Array,
    default: () => []
  },
  // 上傳限制
  uploadMaxCount: {
    type: Number,
    default: 1
  },
  // 上傳檔案類型
  uploadType: {
    type: String,
    default: "image/*"
  },
  // 上傳檔案
  fileList: {
    type: Array,
    default: () => []
  },
  // 文件地址
  fileUrl: {
    type: String,
    default: ''
  },
  // 禁用
  disabled: {
    type: Boolean,
    default: false
  },
  inputContents: {
    type: String,
    default: ''
  }
})

// 事件觸發
const inputContents = ref(props.selectValue);
const emits = defineEmits(['handleChange'])
const handleChange = (value) => {
  // console.log('handleChange', props.type, value);
  const changeHandlers = {
    'input-text': () => emits('handleChange', inputContents.value),
    'select-common': () => emits('handleChange', value),
    'upload-file': () => {
      // console.log('handleChange - upload-file', value);
      emits('handleChange', fileUrl.value);
    },
    'editor': () => {
      // console.log('handleChange - editor', valueHtml.value)
      emits('handleChange', valueHtml.value)
    }
  };
  changeHandlers[props.type]?.();
};

// 上傳的文件
const fileList = ref([]);
const fileUrl = ref(props.fileUrl); // 上傳文件返回地址
const key = 'uploadFile';
const uploadContent = ref('文件上传中');

// 文件上传
const customUpload = async (options) => {
  const {file, onSuccess, onError} = options;
  // console.log('customUpload', file);
  message.loading({content: () => uploadContent.value, key});  // 显示加载中的消息
  try {
    const response = await cosApi.uploadFile(file);  // 上传文件
    if (response.data.code === 200) {
      fileUrl.value = response.data.result;  // 上传成功，保存图片链接
      onSuccess(file);
      uploadContent.value = '文件上传成功';  // 更新上传状态
      message.success({content: '文件上传成功', key, duration: 2});
    } else {
      onError(new Error('上传失败'));
      uploadContent.value = '文件上传失败';  // 上传失败
      message.error({content: '文件上传失败', key, duration: 2});
    }
  } catch (error) {
    uploadContent.value = '文件上传失败';  // 异常处理
    message.error({content: '文件上传失败', key, duration: 2});
  }
}

// 清空上傳
const handleRemove = () => {
  fileUrl.value = '';
}
// 文檔類型限制
const fileType = ref('')
const uploadTxt = (uploadType) => {
  if (uploadType === 'IMAGE') {
    fileType.value = 'image/*';
    return "(請選擇圖片)";
  } else if (uploadType === 'VIDEO') {
    fileType.value = 'video/*';
    return "(請選擇視頻)"
  } else if (uploadType === 'DOCUMENT') {
    fileType.value = '.pdf';
    return "(請上傳pdf附件)"
  }
}

// 富文本编辑器配置
const editorRef = shallowRef();
const valueHtml = inputContents.value === '' ? ref('<p>請輸入內容</p>') : ref(props.inputContents)
watch(() => props.inputContents, (newVal) => {
  // console.log(newVal)
  valueHtml.value = newVal || '<p>請輸入內容</p>';
});
const toolbarConfig = {
  toolbarKeys: ['bold', 'italic', 'emotion'], // 仅显示加粗、斜体和表情菜单
}
const editorConfig = {
  placeholder: '请输入内容...',
}
const handleCreated = (editor) => {
  editorRef.value = editor
}
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const TempStore = useTempStore()
onBeforeMount(() => {
  if (TempStore.createTempData && TempStore.createTempData.components) {
    const bodyComponent = TempStore.createTempData.components.find(
        (component) => component.type === 'BODY'
    );
    if (bodyComponent) {
      valueHtml.value = bodyComponent.text;
    }
  }
})

</script>

<style scoped>

</style>
