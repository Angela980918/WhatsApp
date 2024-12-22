<template>
  <a-flex justify="space-between" align="center">
    <div class="contentLeft">
      <a-form
          :label-col="labelCol"
          layout="horizontal"
          style="max-width: 800px;min-width: 600px;"
          ref="formRef"
          :rules="rules"
          :model="formState"
      >
        <a-col span="16">
          <a-form-item label="模板名稱" name="tempName">
            <select-input v-model:value="formState.tempName" @handleChange="nameChange" type="input-text"
                          :max-txt="512"></select-input>
          </a-form-item>
        </a-col>


        <a-col span="8">
          <a-form-item label="分類" name="selectCategory">
            <select-input @handleChange="categoryChange" type="select-common"
                          v-model:value="formState.selectCategory"
                          :select-options="allCategory" :select-value="formState.selectCategory"></select-input>
          </a-form-item>
        </a-col>

        <a-col span="8">
          <a-form-item label="語言" name="selectLanguage">
            <select-input @handleChange="languageChange" type="select-common"
                          v-model:value="formState.selectLanguage"
                          :select-options="allLanguage" :select-value="formState.selectLanguage"></select-input>
          </a-form-item>
        </a-col>

        <a-col span="8">
          <a-form-item label="頂部" name="selectHeader">
            <select-input @handleChange="headerChange" type="select-common"
                          v-model:value="formState.selectHeader"
                          :select-options="allHeader" :select-value="formState.selectHeader"></select-input>
          </a-form-item>
        </a-col>


        <a-col span="12" v-if="formState.selectHeader !== 'NONE'">
          <a-col span="24" v-if="formState.selectHeader === 'TEXT'">
            <a-form-item label="文本標題" name="selectTitle">
              <select-input v-model:value="formState.titleContents" @handleChange="titleChange"
                            type="input-text" :max-txt="60"></select-input>
            </a-form-item>
          </a-col>

          <a-col span="16" v-else-if="formState.selectHeader === 'MEDIA'">
            <a-form-item label="附件類型" name="selectMedia">
              <select-input v-model:value="formState.selectMedia" @handleChange="mediaChange"
                            type="select-common" :select-options="allMedia"
                            :select-value="formState.selectMedia"></select-input>
            </a-form-item>
          </a-col>
        </a-col>

        <a-col span="24" v-if="formState.selectMedia">
          <a-form-item label="上傳" name="selectFile">
            <select-input @handleChange="fileChange" :upload-type="formState.selectMedia" type="upload-file"
                          v-model:value="formState.selectFile"></select-input>
          </a-form-item>
        </a-col>

        <a-col span="24">
          <a-form-item label="内容" name="editor">
            <select-input @handleChange="htmlChange" :inputContents="formState.editor"
                          type="editor"></select-input>
          </a-form-item>
        </a-col>

        <a-col span="14">
          <a-form-item label="底部" name="footer">
            <select-input v-model:value="formState.footer" :select-value="formState.footer" @handleChange="footerChange"
                          name="footer" type="input-text"
                          :max-txt="60"></select-input>
          </a-form-item>
        </a-col>

        <a-col span="14">
          <a-form-item>
            <a-flex justify="center">
              <a-button type="primary" @click.prevent="onSubmit">提交</a-button>
              <a-button style="margin-left: 10px" @click="resetFields">清空</a-button>
            </a-flex>
          </a-form-item>
        </a-col>

      </a-form>
    </div>


    <div class="phoneBox"> <!-- 确保居中 -->
      <div class="phone">
        <div class="phoneTop"/>
        <div class="phoneCenter">
          <div class="arrow"/>
          <div class="content">
            <h6 class="contentHeader" v-if="formState.selectHeader === 'TEXT'">{{ formState.titleContents }}</h6>
            <div class="mediaCenter" v-else-if="formState.selectHeader === 'MEDIA'">
              <div v-if="formState.selectMedia === 'IMAGE'">
                <a-flex v-if="formState.selectFile !== ''" justify="center" align="center"
                        style="width: 100%; height: 130px">
                  <a-image height="100%" width="100%" :src="formState.selectFile"></a-image>
                </a-flex>
                <a-flex style="width: 100%; height: 130px; background: rgb(215, 213, 223)" v-else justify="center"
                        align="center">
                  <FileImageOutlined style="font-size: 50px; color: #ffffff;"/>
                </a-flex>
              </div>
              <div v-else-if="formState.selectMedia === 'VIDEO'">
                <a-flex v-if="formState.selectFile !== ''" justify="center" align="center"
                        style="width: 100%; height: 130px">
                  <iframe :src="formState.selectFile" style="width: 100%; height: 100%">
                  </iframe>
                </a-flex>
                <a-flex style="width: 100%; height: 130px; background: rgb(215, 213, 223)" v-else justify="center"
                        align="center">
                  <VideoCameraOutlined style="font-size: 50px; color: #ffffff;"/>
                </a-flex>
              </div>
              <div v-else-if="formState.selectMedia === 'DOCUMENT'">
                <a-flex v-if="formState.selectFile !== ''" justify="center" align="center"
                        style="width: 100%; height: 130px">
                  <iframe :src="formState.selectFile" style="width: 100%; height: 130px">
                  </iframe>
                </a-flex>
                <a-flex style="width: 100%; height: 130px; background: rgb(215, 213, 223)" v-else justify="center"
                        align="center">
                  <FilePdfOutlined style="font-size: 50px; color: #ffffff;"/>
                </a-flex>
              </div>
            </div>

            <p class="contentBody" v-html="formState.editor"></p>
            <p class="contentFooter">{{ formState.footer }}</p>
          </div>
        </div>
        <div class="phoneBottom"/>
      </div>
    </div>
  </a-flex>

</template>
<script lang="ts" setup>
import {ref, reactive, toRaw} from 'vue';
import {
  FileImageOutlined,
  FilePdfOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons-vue';
import {SelectProps, message} from 'ant-design-vue';
import {cosApi} from "@/api/whatsapp/index.js";
import SelectInput from "@/components/templates/SelectInput.vue";
import type {Rule} from 'ant-design-vue/es/form';
import type {UnwrapRef} from 'vue';
import {templateApi} from "@/api/ycloud/index.js";

const labelCol = {style: {width: '100px'}};

// 模板名稱
const nameChange = (value) => {
  formState.tempName = value
}

// 分類
const allCategory = ref<SelectProps['options']>([
  {label: '通用', value: 'UTILITY'},
  {label: '營銷', value: 'MARKETING'},
  {label: '認證', value: 'AUTHENTICATION'}
]);
const categoryChange = (value) => {
  formState.selectCategory = value;
}

// 語言
const allLanguage = ref<SelectProps['options']>([
  {label: '簡體中文', value: 'zh_CN'},
  {label: '繁體中文', value: 'zh_HK'},
  {label: '英文', value: 'en_US'},
]);
const languageChange = (value) => {
  formState.selectLanguage = value;
}

// 頂部類型
const allHeader = ref<SelectProps['options']>([
  {label: '無', value: 'NONE'},
  {label: '文本', value: 'TEXT'},
  {label: '媒體', value: 'MEDIA'}
]);
const headerChange = (value) => {
  formState.selectHeader = value;
}

// 文本標題
const titleChange = (value) => {
  formState.titleContents = value;
}

// 媒體類型
const allMedia = ref<SelectProps['options']>([
  {label: '圖片', value: 'IMAGE'},
  {label: '影片', value: 'VIDEO'},
  {label: '文檔', value: 'DOCUMENT'}
]);
const mediaChange = (value) => {
  formState.selectMedia = value;
}
const fileChange = (value) => {
  formState.selectFile = value
}

// 上傳的文件
const key = 'uploadFile';
const uploadContent = ref('文件上传中');

// 文件上传
const customUpload = async (options) => {
  const {file, onSuccess, onError} = options;
  message.loading({content: () => uploadContent.value, key});  // 显示加载中的消息
  try {
    const response = await cosApi.uploadFile(file);  // 上传文件
    if (response.data.code === 200) {
      formState.selectFile = response.data.result;  // 上传成功，保存图片链接
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

// 富文本
const htmlChange = (value) => {
  formState.editor = value
}

// 底部
const footerChange = (value) => {
  formState.footer = value
}

// 表單
const formRef = ref();

interface FormState {
  tempName: string;
  selectCategory: string;
  selectLanguage: string;
  selectHeader: string;
  titleContents: string;
  selectMedia: string;
  selectFile: string;
  editor: string;
  footer: string;
}

const formState: UnwrapRef<FormState> = reactive({
  tempName: '',
  selectCategory: '',
  selectLanguage: '',
  selectHeader: '',
  titleContents: '',
  selectMedia: '',
  selectFile: '',
  editor: '',
  footer: '',
});
const rules: Record<string, Rule[]> = {
  tempName: [
    {required: true, message: '模板名稱不能為空', trigger: 'blur'},
  ],
  selectCategory: [
    {required: true, message: '分類不能為空', trigger: 'blur'},
  ],
  selectLanguage: [
    {required: true, message: '語言不能為空', trigger: 'blur'},
  ],
  selectHeader: [
    {required: true, message: '頂部類型必選，如果無頂部請選擇無', trigger: 'blur'},
  ],
  titleContents: [
    {required: true, message: '頂部為文本類型時，標題不能為空', trigger: 'blur'},
  ],
  selectMedia: [
    {required: true, message: '頂部為媒體類型時，附件類型必選', trigger: 'blur'},
  ],
  selectFile: [
    {required: true, message: '請上傳文件', trigger: 'blur'},
  ],
  editor: [
    {required: true, message: '請輸入内容', trigger: 'blur'},
  ],
  footer: [
    {required: true, message: '請輸入底部', trigger: 'blur'},
  ],
};

// 提交
const submitKey = 'submit';
const submitContent = ref('模板數據校驗中');
const onSubmit = () => {
  message.loading({content: submitContent.value, key: submitKey, duration: 1});  // 显示加载中的消息

  formRef.value
      .validate()
      .then(() => {
        submitContent.value = '模板數據提交中';
        message.loading({content: submitContent.value, key: submitKey, duration: 2});  // 显示加载中的消息
        console.log('values', formState, toRaw(formState));
        const formData = {};
        const rawFormState = toRaw(formState);
        Object.keys(rawFormState).forEach(key => {
          switch(key) {
            case 'tempName':
              formData.name = rawFormState.tempName;  // 模板名称
              break;
            case 'selectLanguage':
              formData.language = rawFormState.selectLanguage;  // 语言
              break;
            case 'selectCategory':
              formData.category = rawFormState.selectCategory;  // 类别
              break;
            case 'editor':
              formData.components = formData.components || [];
              formData.components.push({ type: 'BODY', text: rawFormState.editor });  // 内容部分
              break;
            case 'footer':
              formData.components = formData.components || [];
              formData.components.push({ type: 'FOOTER', text: rawFormState.footer });  // 页脚部分
              break;
            case 'selectHeader':
              formData.components = formData.components || [];
              formData.components.push({ type: 'HEADER', text: rawFormState.selectHeader, format: 'TEXT' });  // 头部部分
              break;
            case 'selectFile':
              formData.components = formData.components || [];
              formData.components.push({ type: 'HEADER', format: rawFormState.selectMedia });
              formData.components.push({ example: { header_url: rawFormState.selectFile}});
              break;
              // 其他字段处理
            default:
              break;
          }

        })

        const response = templateApi.createTemplate({
              name: formState.tempName,
              language: formState.selectLanguage,
              category: formState.selectCategory,

            }
        )
        // 處理數據調用接口
        message.success({content: '模板數據提交成功', key: submitKey, duration: 2});
      })
      .catch(error => {
        error.errorFields.forEach((item, index) => {
          message.error({content: item.errors[0], duration: index + 1});
        })
      });
}
// 重置表單的邏輯
const resetFields = () => {
  console.log('Reset button clicked');
  // 清空表單或重置數據邏輯
}


const focus = () => {
  console.log('focus');
};

</script>

<style scoped>
.phoneBox {
  min-width: 320px;
  width: calc(100% - 616px);
  height: calc(100% - 120px);
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  align-items: flex-start;

  .phone {
    top: 74px;
    right: 92px;
    min-height: 595px;
    max-height: 100%;
    display: flex;
    flex-direction: column;

    .phoneTop {
      background-image: url(https://app.salesmartly.com/img/phoneheader.4b8c90cf.png);
      background-size: contain;
      background-repeat: no-repeat;
      width: 320px;
      height: 83px;
      position: relative;
      bottom: -1px;
      flex-shrink: 0;
    }

    .phoneCenter {
      width: 320px;
      min-height: 445px;
      height: calc(100% - 146px);
      overflow-y: auto;
      box-sizing: border-box;
      border-left: 5.5px solid rgb(26, 30, 34);
      border-right: 5.5px solid rgb(26, 30, 34);
      background-color: rgb(232, 224, 213);
      padding: 18px 13px 9px;
      position: relative;

      .arrow {
        width: 0px;
        height: 0px;
        border-width: 3.5px;
        border-style: solid;
        border-color: rgb(255, 255, 255) rgb(255, 255, 255) transparent transparent;
        border-image: initial;
        position: absolute;
        left: 7px;
      }

      .content {
        background-color: rgb(255, 255, 255);
        border-radius: 0px 8px 8px;
        padding: 8px;

        .contentHeader {
          margin: 0px 0px 4px;
          font-size: 16px;
          font-weight: 600;
          line-height: 24px;
          font-family: Roboto, Helvetica, Arial, sans-serif;
          letter-spacing: 0.00938em;
          word-break: break-word;
          white-space: break-spaces;
        }

        .contentBody {
          margin: 0px;
          font-size: 16px;
          font-weight: 400;
          font-family: Roboto, Helvetica, Arial, sans-serif;
          letter-spacing: 0.01071em;
          line-height: 24px;
          word-break: break-word;
          white-space: break-spaces;
        }

        .contentFooter {
          margin: 4px 0px 0px;
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          font-family: Roboto, Helvetica, Arial, sans-serif;
          letter-spacing: 0.00938em;
          color: rgb(162, 157, 174);
          overflow-wrap: break-word;
        }
      }
    }

    .phoneBottom {
      background-image: url(https://app.salesmartly.com/img/phonebottom.a32a8d85.png);
      background-size: contain;
      background-repeat: no-repeat;
      width: 320px;
      height: 63px;
      position: relative;
      top: -1px;
      flex-shrink: 0;
    }
  }
}
</style>

