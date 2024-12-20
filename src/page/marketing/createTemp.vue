<template>
  <div class="createContaianer">
    <div class="tempHeader">
      <WASelect name="t_tempName" :require="true" direction="vertical" title="模板名稱" type="input-text" :maxTxt="512"
                :inputContents="inputContents" @handleChange="nameChange"/>
      <WASelect name="t_selectCategory" :require="true" direction="vertical" title="分類" type="select-common"
                :select-item="selectCategory" :options="category" @handleChange="categoryChange"/>
    </div>

    <div class="tempContainer">
      <div class="contentLeft">
        <WASelect name="t_selectLanguage"  :require="true" direction="vertical" title="語言" type="select-common"
                  :select-item="selectLanguage" :options="language" @handleChange="languageChange"/>

        <div class="Header">
          <WASelect name="t_selectHeader"  :require="true" direction="vertical" title="頭部" type="select-common"
                    :select-item="selectHeader" :options="headers" @handleChange="headerChange"/>

          <div v-if="selectHeader.value === 'TEXT'">
            <WASelect name="t_headerTxt" direction="vertical" :require="true" title="標題" type="input-text" :maxTxt="60"
                      :inputContents="headerTxt" @handleChange="headerTxtChange"/>
          </div>

          <div v-else-if="selectHeader.value === 'MEDIA'">
            <div>
              <WASelect name="t_mediaValue" :require="true" direction="vertical" title="内容形式" type="select-common"
                        :select-item="mediaValue" :options="mediaOptions" @handleChange="contentChange"/>
            </div>

            <div v-if="mediaValue.value === 'IMAGE'">
              <WASelect name="t_upload" :require="true" direction="horizontal" title="上傳素材" type="upload-file"
                        @handleChange="beforeUpdate" uploadType="image/*"/>
            </div>

            <div v-else-if="mediaValue.value === 'VIDEO'">
              <WASelect name="t_video"  :require="true" direction="horizontal" title="上傳視頻" type="upload-file"
                        @handleChange="beforeUpdate" uploadType="video/*"/>
            </div>

            <div v-else-if="mediaValue.value === 'DOCUMENT'">
              <WASelect name="t_pdf" :require="true" direction="horizontal" title="上傳文檔" type="upload-file"
                        @handleChange="beforeUpdate" uploadType=".pdf"/>
            </div>
          </div>

          <WASelect name="t_editor" :require="true" direction="vertical" title="内容" type="editor" :inputContents="valueHtml"
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
                <h6 class="contentHeader" v-if="selectHeader.value === 'TEXT'">{{ headerTxt }}</h6>
                <a-image
                    v-if="selectHeader.value === 'MEDIA' && mediaValue.value === 'IMAGE'"
                    :height="180"
                    width="100%"
                    fallback="data:image/png;base64,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"
                />
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
import {onMounted, ref, watch} from "vue";
import WASelect from "@/components/templates/WASelect.vue";
import {templateApi} from "@/api/ycloud/index.js";
import {useRoute, useRouter} from "vue-router";
import {defineProps} from 'vue';

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};

const router = useRouter();

const selectCategory = ref({});
const category = [
  {value: 'Utility', lang: 'UTILITY'},
  {value: 'Marketing', lang: 'MARKETING'},
  {value: 'Authentication', lang: 'AUTHENTICATION'}
];

const selectLanguage = ref({});
const language = [
  {value: '簡體中文', lang: 'zh_CN'},
  {value: '繁體中文', lang: 'zh_HK'},
  {value: '英文', lang: 'en_US'},
]

const selectHeader = ref({
});
const headers = [
  {label: '無', value: 'NONE'},
  {label: '文本', value: 'TEXT'},
  {label: '媒體', value: 'MEDIA'}
]

const mediaValue = ref({});
const mediaOptions = [
  {label: '圖片', value: 'IMAGE'},
  {label: '視頻', value: 'VIDEO'},
  {label: '文檔', value: 'DOCUMENT',},
]
const testUrl = ref("https://i.loli.net/2021/04/07/QgHvB7hlJyCnN8s.jpg")
let inputContents = ref('');
let headerTxt = ref('');
let footerContent = ref('');
const fileList = ref([
  {
    uid: '-4',
    name: 'image.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
]);

let valueHtml = ref('');
const htmlChange = (value) => {
  valueHtml.value = value
}
const beforeUpdate = file => {
  console.log('beforeUpdate',file)
  fileList.value.push(file)
  return false
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
      selectHeader.value = item
    }
  })
}

const contentChange = (value) => {
  mediaOptions.map(item => {
    if (item.value === value) {
      console.log("item", item)
      mediaValue.value = item
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
  if (selectLanguage.value === "") {
    return "請選擇模板語言"
  }

  if (selectHeader.value === "None") {
    return "請填寫模板頂部信息"
  }

  if (mediaValue.value === "") {
    return "請選擇模板頂部信息類型"
  }

  if (selectHeader.value.value === 'Text' && inputContents.value === "") {
    return "請填寫頂部信息"
  }

  if (selectHeader.value.value === 'Media' && fileList.value.length === 0) {
    return "請選擇文件"
  }

  if (valueHtml.value === "") {
    return "請填寫Body的內容"
  }

  return "";
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
  if (selectHeader.value.value === 'TEXT') {
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
  // const message = checkData();

  // if(message !== "") {
  //     console.log("錯誤信息", message)
  // }

  let data = {
    name: inputContents.value,
    language: selectLanguage.value.lang,
    category: selectCategory.value.lang,
    components: createComponent()
  }
  console.log("datadatadata", data)
  const response = await templateApi.createTemplate(data)
  if (response.status === 200) {
    router.back();
  }
}

const cancel = () => {
  router.back();
}

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
