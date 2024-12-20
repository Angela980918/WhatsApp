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
          <WASelect name="t_selectHeader"  :require="true" direction="vertical" title="Header" type="select-common"
                    :select-item="selectHeader" :options="headers" @handleChange="headerChange"/>

          <div v-if="selectHeader.value === 'Text'">
            <WASelect name="t_headerTxt" direction="vertical" :require="true" title="内容" type="input-text" :maxTxt="60"
                      :inputContents="headerTxt" @handleChange="headerTxtChange"/>
          </div>

          <div v-else-if="selectHeader.value === 'Media'">
            <div>
              <WASelect name="t_mediaValue" :require="true" direction="vertical" title="內容形式" type="select-common"
                        :select-item="mediaValue" :options="mediaOptions" @handleChange="contentChange"/>
            </div>

            <div v-if="mediaValue.value === 'Image'">
              <WASelect name="t_upload" :require="true" direction="horizontal" title="上傳素材" type="upload-file"
                        @handleChange="beforeUpdate" uploadType="image/*"/>
            </div>

            <div v-else-if="mediaValue.value === 'Video'">
              <WASelect name="t_video"  :require="true" direction="horizontal" title="上傳視頻" type="upload-file"
                        @handleChange="beforeUpdate" uploadType="video/*"/>
            </div>

            <div v-else-if="mediaValue.value === 'PDF'">
              <WASelect name="t_pdf" :require="true" direction="horizontal" title="上傳文檔" type="upload-file"
                        @handleChange="beforeUpdate" uploadType=".pdf"/>
            </div>
          </div>

          <WASelect name="t_editor" :require="true" direction="vertical" title="Body" type="editor" :inputContents="valueHtml"
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
                <h6 class="contentHeader">{{ headerTxt }}</h6>
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

// 接收路由传递的参数

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
  {value: 'None', lang: 'None'},
  {value: 'Text', lang: 'Text'},
  {value: 'Media', lang: 'Media'}
]

const mediaValue = ref({});
const mediaOptions = [
  {label: 'IMAGE', value: 'Image'},
  {label: 'VIDEO', value: 'Video'},
  {label: 'DOCUMENT', value: 'PDF',},
]
const testUrl = ref("https://i.loli.net/2021/04/07/QgHvB7hlJyCnN8s.jpg")
let inputContents = ref('');
let headerTxt = ref('');
let footerContent = ref('');
const fileList = ref([]);

let valueHtml = ref('');
const htmlChange = (value) => {
  valueHtml.value = value
}
const beforeUpdate = file => {
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

const headerTxtChange = (value) => {
  headerTxt.value = value
}

const contentChange = (value) => {
  console.log("value", value)
  mediaOptions.map(item => {
    if (item.value === value) {
      console.log("item", item)
      mediaValue.value = item
    }
  })
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
  // console.log("selectHeader.value",selectHeader.value)
  if (selectHeader.value.value === 'Text') {
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
