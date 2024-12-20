<template>
  <div :style="
        {
            'flex-direction': props.direction === 'vertical' ? 'column' : 'row',
            'align-items': props.direction === 'vertical' ? 'flex-start' : 'center',
            'margin-top': props.direction === 'vertical' ? '10px' : '18px',
            'width': props.type === 'editor' || props.type === 'upload-file' ? '100%' : '30%'
        }"
       class="selectCard"
  >
        <span :class="{
            'selectTitle': props.require,
            'selectCardTitle' : true
        }"
              :style="{
            'margin-bottom': props.direction === 'vertical' ? '12px' : 0
              }"
              v-if="props.title !== undefined">{{ props.title }}</span>

    <template v-if="props.type === 'search'">
      <a-input
          :name="props.name"
          v-model:value="searchContents"
          allow-clear
          style="flex-grow: 1; width: 100%;"
          @change="handleChange"
      >
        <template #prefix>
          <SearchOutlined/>
        </template>
      </a-input>
    </template>

    <template v-else-if="props.type === 'select-common'">
      <a-select
          :name="props.name"
          v-model:value="selectItem"
          @change="handleChange"
          style="flex-grow: 1; width: 100%"
          :options="selectOptions"
          :disabled="props.disabled"
      ></a-select>
    </template>

    <template v-else-if="props.type === 'select-multiple'">
      <a-select
          :name="props.name"
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
          :name="props.name"
          v-model:value="inputContents"
          show-count
          @change="handleChange"
          :disabled="props.disabled"
          :maxlength="props.maxTxt"/>
    </template>

    <template v-else-if="props.type === 'upload-file'">
      <a-upload
          :name="props.name"
          v-model:file-list="selectItem"
          :before-upload="handleChange"
          :accept="uploadType"
      >
        <a-button>
          <upload-outlined></upload-outlined>
          選擇文件
        </a-button>
      </a-upload>
      <span style="color: #808695; font-size: 14px">{{ uploadTxt() }}</span>
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
  </div>
</template>

<script setup>
import {defineProps, onBeforeUnmount, ref, shallowRef} from 'vue';
import {SearchOutlined, UploadOutlined} from '@ant-design/icons-vue';

import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'

const props = defineProps({
  name: {
    type: String,
    default: "name"
  },
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
    default: {}
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
    type: Number,
    default: undefined
  },
  uploadType: {
    type: String,
    default: 'image/*'
  },
  disabled: {
    // 禁用狀態
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(['handleChange'])
const selectItem = ref(props.selectItem);
const selectOptions = ref(props.options);
const searchContents = ref(props.searchContents);
const inputContents = ref(props.inputContents);

// 富文本编辑器配置
const editorRef = shallowRef();
const valueHtml = inputContents.value === '' ? ref('<p>請輸入內容</p>') : ref(props.inputContents)
const toolbarConfig = {
  toolbarKeys: ['bold', 'italic', 'emotion'], // 仅显示加粗、斜体和表情菜单
}
const editorConfig = {
  placeholder: '请输入内容...',
}
// editorConfig.onBlur = (editor) => {
//     console.log("value::::", valueHtml.value);
//     emits('handleChange', valueHtml.value)
// }
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor
}

const fileList = ref([]);
const uploadTxt = () => {
  if (props.uploadType === 'image/*') {
    return "(請選擇圖片)";
  } else if (props.uploadType === 'video/*') {
    return "(請選擇視頻)"
  } else if (props.uploadType === '.pdf') {
    return "(請上傳pdf附件)"
  }
}
const handleChange = (value) => {
  if (props.type === 'search') {
    emits('handleChange', searchContents.value)
  } else if (props.type === 'input-text') {
    emits('handleChange', inputContents.value)
  } else if (props.type === 'upload-file') {
    fileList.value.push(value);
    emits('handleChange', fileList.value)
    return false;
  } else if (props.type === 'editor') {
    emits('handleChange', valueHtml.value)
  } else {
    emits('handleChange', selectItem.value)
  }
};

editorRef.onclick = () => {
  console.log("test")
}

</script>

<style scoped>
.selectCard {
  display: flex;
  padding: 0 12px;
  max-width: 100%;
}

.selectCardTitle {
  font-size: 16px;
  padding-right: 10px;
  flex-grow: 0;
  white-space: nowrap;
}

.selectTitle::before {
  content: '*';
  color: red;
  margin-right: 5px; /* 调整星号和文本之间的距离 */
}
</style>
