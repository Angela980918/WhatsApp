<template>
  <div class="createContaianer">
    <div class="tempHeader">
        <WASelect require="true" direction="vertical" title="Template name" type="input-text" maxTxt="512" :inputContents="inputContents" @handleChange="nameChange" />
        <WASelect require="true" direction="vertical" title="Category" type="select-common" :select-item="selectCategory" :options="category" @handleChange="categoryChange"/>
    </div>
<!--v-if="!(inputContents === '' || selectCategory.length === 0)"-->
      <div class="tempContainer" >
          <div class="contentLeft">
              <WASelect require="true" direction="vertical" title="語言" type="select-common" :select-item="selectLanguage" :options="language" @handleChange="languageChange"/>

              <div class="Header">
                  <WASelect direction="vertical" title="Header" type="select-common" :select-item="selectHeader" :options="headers" @handleChange="headerChange"/>

                  <div v-if="selectHeader.value === 'Text'">
                      <WASelect direction="vertical" require="true" title="内容" type="input-text" maxTxt="60" :inputContents="headerTxt" @handleChange="headerTxtChange" />
                  </div>

                  <div v-else-if="selectHeader.value === 'Media'">
                      <div>
                          <WASelect require="true" direction="vertical" title="內容形式" type="select-common" :select-item="mediaValue" :options="mediaOptions" @handleChange="contentChange"/>
                      </div>

                      <div v-if="mediaValue === 'Image'">
                          <WASelect require="true" direction="horizontal" title="上傳素材" type="upload-file" @handleChange="beforeUpdate" uploadType="image/*"/>
                      </div>

                      <div v-else-if="mediaValue === 'Video'">
                          <WASelect require="true" direction="horizontal" title="上傳視頻" type="upload-file" @handleChange="beforeUpdate" uploadType="video/*"/>
                      </div>

                      <div v-else-if="mediaValue === 'PDF'">
                          <WASelect require="true" direction="horizontal" title="上傳文檔" type="upload-file" @handleChange="beforeUpdate" uploadType=".pdf"/>
                      </div>
                  </div>

                  <div style="    display: flex;
    padding: 0 12px;
    width: 100%; /* 可以根据需求修改宽度 */">
                      <Editor/>
                  </div>
              </div>
          </div>

          <div class="contentRight">
                <div style="display: flex;flex: 1">
123456
                </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import WASelect from "@/components/templates/WASelect.vue";
import Templates from "@/page/marketing/templates.vue";
import { UploadOutlined } from '@ant-design/icons-vue';
import Editor from "@/components/templates/Editor.vue";

  const selectCategory = ref([]);
  const category = [
      { value: 'Utility'},
      { value: 'Marketing' },
      { value: 'Authentication' }
  ];

  const selectLanguage = ref([]);
  const language = [
      { value: 'Chinese (CHN)', lang: 'zh_CN', kind: 'language'  },
      { value: 'Chinese (HKG)', lang: 'zh_HK', kind: 'language'  },
      { value: 'English', lang: 'en', kind: 'language'  },
  ]

  const selectHeader = ref('None');
  const headers = [
      { value: 'None' },
      { value: 'Text' },
      { value: 'Media' }
  ]

  const mediaValue = ref('');
  const mediaOptions = [
      { label: 'Image', value: 'Image' },
      { label: 'Video', value: 'Video' },
      { label: 'PDF', value: 'PDF', },
  ]

  let inputContents = ref('');
  let headerTxt = ref('');
  const fileList = ref([]);
  const beforeUpdate = file => {
      console.log("file",file)
      fileList.value.push(file)
      return false
  };

  const nameChange = (newValue) => {
    inputContents.value = newValue;
  }

  const categoryChange = (value) => {
    category.map(item => {
        if(item.value === value) {
            selectCategory.value.push(item)
        }
    })
  }

  const languageChange = (value) => {

  }

  const headerChange = (value) => {
      headers.map(item => {
          if(item.value === value) {
              selectHeader.value = item
          }
      })
      console.log("selectHeader",selectHeader)
  }

  const uploadFile = (value) => {
      console.log("value",value)
  }

  const headerTxtChange = (value) => {

  }

  const contentChange = (value) => {
      mediaOptions.map(item => {
          if(item.value === value) {
              mediaValue.value = item.value
          }
      })
      console.log("mediaValue",mediaValue)
  }


</script>

<style scoped>
  .createContaianer {

  }
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
      .contentLeft {
          width: 100%;
      }
  }
</style>
