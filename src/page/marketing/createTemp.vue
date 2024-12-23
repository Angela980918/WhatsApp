<template>
  <div class="createContaianer">
    <div class="tempHeader">
      <WASelect :disabled="isDisable" name="t_tempName" :require="true" direction="vertical" title="模板名稱"
                type="input-text" :maxTxt="512"
                :inputContents="inputContents" @handleChange="nameChange"/>
      <WASelect :disabled="isDisable" name="t_selectCategory" :require="true" direction="vertical" title="分類"
                type="select-common"
                :select-item="selectCategory" :options="category" @handleChange="categoryChange"/>
    </div>

    <div class="tempContainer">
      <div class="contentLeft">
        <WASelect :disabled="isDisable" name="t_selectLanguage" :require="true" direction="vertical" title="語言"
                  type="select-common"
                  :select-item="selectLanguage" :options="language" @handleChange="languageChange"/>

        <div class="Header">
          <WASelect name="t_selectHeader" :require="true" direction="vertical" title="頂部" type="select-common"
                    :select-item="selectHeader" :options="headers" @handleChange="headerChange"/>

          <div v-if="selectHeader === 'TEXT'">
            <WASelect name="t_headerTxt" direction="vertical" :require="true" title="標題" type="input-text"
                      :maxTxt="60"
                      :inputContents="headerTxt" @handleChange="headerTxtChange"/>
          </div>

          <div v-else-if="selectHeader === 'MEDIA'">
            <div>
              <WASelect name="t_mediaValue" :require="true" direction="vertical" title="附件類型" type="select-common"
                        :file-item="mediaValue" :options="mediaOptions" @handleChange="contentChange"/>
            </div>

            <div v-if="mediaValue === 'IMAGE'">
              <WASelect name="t_upload" :require="true" direction="horizontal" title="上傳素材" type="upload-file"
                        @handleChange="beforeUpdate" uploadType="image/*"/>
            </div>

            <div v-else-if="mediaValue === 'VIDEO'">
              <WASelect name="t_video" :require="true" direction="horizontal" title="上傳視頻" type="upload-file"
                        @handleChange="beforeUpdate" uploadType="video/*"/>
            </div>

            <div v-else-if="mediaValue === 'DOCUMENT'">
              <WASelect name="t_pdf" :require="true" direction="horizontal" title="上傳文檔" type="upload-file"
                        @handleChange="beforeUpdate" uploadType=".pdf"/>
            </div>
          </div>

          <WASelect name="t_editor" :require="true" direction="vertical" title="内容" type="editor"
                    :inputContents="valueHtml"
                    @handleChange="htmlChange"/>

          <WASelect name="t_footerContent" direction="vertical" title="底部" type="input-text" :maxTxt="60"
                    :inputContents="footerContent" @handleChange="footerChange"/>


          <a-space style="padding: 12px" wrap>
            <a-button type="primary" @click="confirm">提交模板</a-button>
            <a-button @click="cancel">取消</a-button>
          </a-space>
        </div>
      </div>

      <div class="contentRight" style="align-items: center">
        <div class="phoneBox"> <!-- 确保居中 -->
          <div class="phone">
            <div class="phoneTop"/>
            <div class="phoneCenter">
              <div class="arrow"/>
              <div class="content">
                <h6 class="contentHeader" v-if="selectHeader === 'TEXT'">{{ headerTxt }}</h6>
                <div class="mediaCenter" v-if="selectHeader === 'MEDIA'">
                  <div v-if="mediaValue === 'IMAGE'">
                    <a-flex v-if="fileUrl !== ''" justify="center" align="center" style="width: 100%; height: 130px">
                      <a-image height="100%" width="100%" :src="fileUrl"></a-image>
                    </a-flex>
                    <a-flex style="width: 100%; height: 130px; background: rgb(215, 213, 223)" v-else justify="center"
                            align="center">
                      <FileImageOutlined style="font-size: 50px; color: #ffffff;"/>
                    </a-flex>
                  </div>
                  <div v-else-if="mediaValue === 'VIDEO'">
                    <a-flex v-if="fileUrl !== ''" justify="center" align="center" style="width: 100%; height: 130px">
                      <iframe :src="fileUrl" style="width: 100%; height: 100%">
                      </iframe>
                    </a-flex>
                    <a-flex style="width: 100%; height: 130px; background: rgb(215, 213, 223)" v-else justify="center"
                            align="center">
                      <VideoCameraOutlined style="font-size: 50px; color: #ffffff;"/>
                    </a-flex>
                  </div>
                  <div v-else-if="mediaValue === 'DOCUMENT'">
                    <a-flex v-if="fileUrl !== ''" justify="center" align="center" style="width: 100%; height: 130px">
                      <iframe :src="fileUrl" v-if="fileUrl !== ''" style="width: 100%; height: 130px">
                      </iframe>
                    </a-flex>
                    <a-flex style="width: 100%; height: 130px; background: rgb(215, 213, 223)" v-else justify="center"
                            align="center">
                      <FilePdfOutlined style="font-size: 50px; color: #ffffff;"/>
                    </a-flex>
                  </div>
                </div>

                <p class="contentBody" v-html="valueHtml"></p>
                <p class="contentFooter">{{ footerContent }}</p>
              </div>
            </div>
            <div class="phoneBottom"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onBeforeMount, onMounted, onUnmounted, ref} from "vue";
import WASelect from "@/components/templates/WASelect.vue";
import {useRouter} from "vue-router";
import {message} from 'ant-design-vue';
import {cosApi} from "@/api/whatsapp/index.js";
import {FileImageOutlined, FilePdfOutlined, VideoCameraOutlined} from '@ant-design/icons-vue';
import {useTempStore} from "@/store/useTempStore.js";

const previewVisible = ref(false);
const previewTitle = ref('');
const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};

const TempStore = useTempStore();

const router = useRouter();

// 禁用狀態
const isDisable = ref(false)

const selectCategory = ref();
const category = [
  {label: '通用', value: 'UTILITY'},
  {label: '營銷', value: 'MARKETING'},
  {label: '驗證', value: 'AUTHENTICATION'}
];

const selectLanguage = ref();
const language = [
  {label: '簡體中文', value: 'zh_CN'},
  {label: '繁體中文', value: 'zh_HK'},
  {label: '英文', value: 'en_US'},
]

  const selectHeader = ref();
const headers = [
  {label: '無', value: 'NONE'},
  {label: '文本', value: 'TEXT'},
  {label: '媒體', value: 'MEDIA'}
]

const mediaValue = ref();
const mediaOptions = [
  {label: '圖片', value: 'IMAGE'},
  {label: '視頻', value: 'VIDEO'},
  {label: '文檔', value: 'DOCUMENT',},
]
const testUrl = ref("https://i.loli.net/2021/04/07/QgHvB7hlJyCnN8s.jpg")
let inputContents = ref('');
let headerTxt = ref('');
let footerContent = ref('');
const fileList = ref([]);

const fileUrl = ref('');


let valueHtml = ref('');
const htmlChange = (value) => {
  valueHtml.value = value
}


const key = 'updatable';
const uploadContent = ref('文件上传中');
const beforeUpdate = async file => {
  // 消息处理
  message.loading({content: () => uploadContent.value, key});  // 显示加载中的消息
  try {
    const response = await cosApi.uploadFile(file[0]);  // 上传文件
    if (response.data.code === 200) {
      fileUrl.value = response.data.result;  // 上传成功，保存图片链接
      uploadContent.value = '文件上传成功';  // 更新上传状态
      message.success({content: '文件上传成功', key, duration: 2});
    } else {
      uploadContent.value = '文件上传失败';  // 上传失败
      message.error({content: '文件上传失败', key, duration: 2});
    }
  } catch (error) {
    uploadContent.value = '文件上传失败';  // 异常处理
    message.error({content: '文件上传失败', key, duration: 2});
  }
};

const nameChange = (newValue) => {
  inputContents.value = newValue;
}

const categoryChange = (value) => {
  category.map(item => {
    if (item.value === value) {
      selectCategory.value = item
    }
  })
}

const languageChange = (value) => {
  language.map(item => {
    if (item.value === value) {
      selectLanguage.value = item
    }
  })
}

const headerChange = (value) => {
  headers.map(item => {
    if (item.value === value) {
      selectHeader.value = value
    }
  })
}

const contentChange = (value) => {
  // 清空上一次值
  fileUrl.value = ''
  mediaOptions.map(item => {
    if (item.value === value) {
      console.log("item", item)
      mediaValue.value = item.value
    }
  })
}

const headerTxtChange = (value) => {
  headerTxt.value = value
}


const footerChange = (value) => {
  footerContent.value = value;
}

const checkData = () => {

  if (inputContents.value.toString().trim() === "") {
    return "請填寫模板名稱"
  }

  if (Object.keys(selectCategory.value).length === 0) {
    return "請選擇模板分類"
  }

  if (Object.keys(selectLanguage.value).length === 0) {
    return "請選擇模板語言"
  }

  if (selectHeader.value === '') {
    return "請選擇模板頭部類型"
  }

  if (selectHeader.value) {
    if (selectHeader.value.value === 'TEXT' && headerTxt.value.toString().trim() === "") {
      return "文本類型下標題不能為空"
    } else if (selectHeader.value.value === 'MEDIA') {
      if (Object.keys(mediaValue.value).length === 0) {
        return "請選擇内容形式"
      } else if (fileList.value.length === 0 || fileUrl.value === '') {
        return "請上传文件"
      }
    }
  }

  if (valueHtml.value === `<p><br></p>`) {
    return "請填寫模板內容"
  }

  if (footerContent.value.toString().trim() === "") {
    return "請填寫模板底部"
  }

  return ''
}

const createComponent = () => {

  let header = {
    type: "HEADER"
  }
  let body = {
    type: "BODY",
  }
  let footer = {
    type: "FOOTER",
  }
  if (selectHeader.value === 'TEXT') {
    header.format = "TEXT";
    header.text = headerTxt.value;
  } else if (selectHeader.value) {
    header.format = mediaValue.value.label;
    let headerUrl = [];
    // 上传上传后的媒体url
    headerUrl.push(testUrl);
    header.exmaple = {header_url: headerUrl}
  }

  body.text = valueHtml.value;
  footer.text = footerContent.value;

  return [
    {...header},
    {...body},
    {...footer}
  ]
}

const confirm = async () => {
  const errorMessage = checkData();

  if (errorMessage !== "") {
    return message.error(errorMessage)
  }

  let data = {
    name: inputContents.value,
    language: selectLanguage.value.lang,
    category: selectCategory.value.lang,
    components: createComponent()
  }
  console.log("datadatadata", data)
  // const response = await templateApi.createTemplate(data)
  // if (response.status === 200) {
  //   router.back();
  // }
}

const cancel = () => {
  router.back();
}

onBeforeMount(() => {
  const createTempData = TempStore.createTempData
  console.log('createTempData', createTempData)
  if (createTempData.length !== 0) {
    isDisable.value = true
    inputContents.value = createTempData.name
    selectCategory.value = category.find(item => item.value === createTempData.category).value
    selectLanguage.value = language.find(item => item.value === createTempData.language).value

    // 處理模板内容部分
    let components = createTempData.components
    // 頭部
    let headerComponent = components.filter(item => item.type === "HEADER")
    if (headerComponent) {
      console.log('headers', headers.find(item => item.value === headerComponent[0].format))
      selectHeader.value = headers.find(item => item.value === headerComponent[0].format).value
      if (headerComponent[0].format === 'TEXT') {
      }
    }
  }
})

onUnmounted(() => {
  TempStore.resetCreateTempData()
})
</script>

<style scoped>

.tempHeader {
  display: flex;
  flex-direction: row;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
}

.tempContainer {
  margin-top: 12px;
  padding: 20px;
  display: flex;
  background-color: #fff;
  flex-direction: row;
  position: relative;

  .contentLeft,
  .contentRight {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .phoneBox {
    min-width: 320px;
    width: calc(100% - 616px);
    height: calc(100% - 120px);
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    align-items: flex-start;
    position: absolute;
    left: 500px;
    top: 24px;

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
}
</style>
