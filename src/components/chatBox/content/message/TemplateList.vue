<template>
    <div>
        <a-modal v-model:open="open" title="選擇模板"   @ok="handleSubmit">
            <a-table :columns="columns" :data-source="templateList">

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <span>
          <a-button :disabled="true">预览</a-button>
          <a-divider type="vertical" />
          <a-button @click="sendTemplate(record)" type="primary">发送</a-button>
        </span>
      </template>
    </template>
  </a-table>
        </a-modal>
    </div>
</template>

<script lang="ts" setup>
import {ref, computed} from "vue";
import * as ycloudApi from "@/api/ycloud/index.js";
import {useChatStore} from "@/store/chatStore";
import {useTempStore} from "@/store/useTempStore";
const chatStore = useChatStore();
const template = useTempStore();
const currentPhone = computed(() => chatStore.currentPhone);
const templateList = computed(() => {
    let list = []
    template.rawTempData.map((item) => {
        if(item.status === "APPROVED") {
            let cloumn = {
                key: item.key,
                name: item.name,
                language: item.language,
                components: item.components
            }
            list.push(cloumn)
        }
    })
    return list;
})

interface DataItem {
    key: string;
    name: string;
    language: number;
}

const columns = [
    {
        key: 'name',
        title: 'name',
        dataIndex: 'name',
        width: '30%',
    },
    {
        key: 'language',
        title: 'language',
        dataIndex: 'language',
    },
    {
    title: 'Action',
    key: 'action',
  },
];

let open = ref(false);
// let tempList = [
//     { key: 0, name: 'test002', language: 'zh_HK' , components:[
//         {
//         type:"BODY",
//         text:"``````😃"
//         },
//         {
//             format: "TEXT",
//             text: "測試",
//             type: "HEADER"
//         },
//         {
//         type:"FOOTER",
//         text:"1"
//         },
//     ]},
//     { key: 1, name: 'test1211', language: 'zh_HK'},
//     { key: 2, name: 'test001', language: 'zh_HK'},
//     { key: 3, name: 'test_1205', language: 'zh_HK'},
// ]
const handleSubmit = () => {
    open.value = !open.value
}



defineExpose({
    controlTemp: () => {
        console.log("4444444")
        handleSubmit();
    }
})

const sendTemplate = async (value) => {

    console.log("value",value);

    const { components } = value

    let sendData = {
        type: "template",
        template: {
            name: value.name,
            language: {
                code: value.language
            }
        },
        from: "+8613672967202",
        to: currentPhone.value
    }

    let msgContent = {}

    for(let index in components) {
        if(components[index].type === "HEADER") {
            msgContent.header = {
                format: components[index].format,
            }
            console.log("components[index].format",components[index].format)
            if(components[index].format === "TEXT") {
                msgContent.header.content = components[index].text;
            }else {
                msgContent.header.content = components[index].example.header_url[0]

            //     修改调api传值(当header为媒体文件，特殊附加)
                let body = {
                    type: "header",
                    parameters: [ {
                        type: components[index].format.toLowerCase()
                    } ]
                }
                const dynamicKey = `${body.parameters[0].type}`;
                let typeIndex = body.parameters[0];
                typeIndex[dynamicKey] = {
                    link: components[index].example.header_url[0]
                };
                sendData.template.components = [body];
                console.log("sendData",sendData)
            }

        }else if(components[index].type === "BODY") {
            msgContent.body = {
                content: components[index].text
            }
        }else if(components[index].type === "FOOTER") {
            msgContent.footer = {
                content: components[index].text
            }
        }
    }

    const { data: resultObj } = await ycloudApi.messageApi.sendMessage(sendData)
    console.log("resultObj",resultObj);
    console.log("msgContent",msgContent);
    let message = {
        position: "outbound",
        id: resultObj.id,
        status: resultObj.status,
        type: resultObj.type,
        time: resultObj.createTime,
    }
    let res = Object.assign(message, msgContent);
    console.log("tres", res)
    chatStore.addMessage(res);
}


</script>

<style scoped>

</style>
