
<template>
    <div class="tempContainer">
        <div class="Common">
            <WASelect direction="horizontal" title="賬號" type="select-common" :select-item="selectAccount" :options="accounts" @handleChange="accountChange"/>
        </div>


        <div class="Common tempSearch">
            <WASelect direction="vertical" title="Search" type="search" :search-contents="searchContents" @handleChange="nameChange"/>

            <WASelect direction="vertical" title="Category" type="select-multiple" :select-item="selectCategory" :options="category" @handleChange="categoryChange"/>

            <WASelect direction="vertical" title="Language" type="select-multiple" :select-item="selectLanguage" :options="language" @handleChange="langChange"/>

            <WASelect direction="vertical" title="Status" type="select-multiple" :select-item="selectStatus" :options="tempStatus" @handleChange="statusChange"/>

<!--            <WASelect direction="vertical" title="Creator" type="select-add" :select-item="selectStatus" :options="tempStatus"/>-->
        </div>

        <div class="Common">
            <div style="margin-bottom: 12px;padding: 0 12px">
                <a-button type="primary" @click="createTemplate">
                    創建模板
                </a-button>
            </div>
            <a-table
                :columns="columns"
                :data-source="filterData"
                class="tempList"
            >
                <template #bodyCell="{ column, record }">

                    <template v-if="column.key === 5">
                        <span>{{formatDate(record.updateTime)}}</span>
                    </template>

                    <template v-if="column.key === 'operation'">
                        <a-dropdown :placement="bottomLeft">
                            <a-button>operation</a-button>
                            <template #overlay>
                                <a-menu>
                                    <a-menu-item>
                                        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                                            查看
                                        </a>
                                    </a-menu-item>
                                    <a-menu-item>
                                        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                                            編輯
                                        </a>
                                    </a-menu-item>
                                    <a-menu-item>
                                        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                                            複製
                                        </a>
                                    </a-menu-item>
                                    <a-menu-item>
                                        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                                            刪除
                                        </a>
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup>
import {onBeforeMount, ref} from 'vue';
import {templateApi, wabaApi} from "@/api/ycloud/index.js";
import WASelect from "@/components/templates/WASelect.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const columns = [
    {
        key: 1,
        title: '模板名稱',
        dataIndex: 'name',
        fixed: 'left',
    },
    {
        key: 2,
        title: '類別',
        dataIndex: 'category',
    },
    {
        key: 3,
        title: '語言',
        dataIndex: 'language',
    },
    {
        key: 4,
        title: '狀態',
        dataIndex: 'status',
    },
    {
        key: 5,
        title: '最近更新',
        dataIndex: 'updateTime',
    },
    // {
    //     key: 6,
    //     title: '已發送/已閱讀',
    //     dataIndex: 'lastSeen',
    // },
    // {
    //     key: 7,
    //     title: '創建方式',
    //     dataIndex: 'lastSeen',
    // },
    {
        title: 'Action',
        key: 'operation',
        fixed: 'right'
    },
];

const data = ref([
    {
        category: "UTILITY",
        name: "test111",
        language: "en_US",
        status: "REJECTED",
        updateTime: "2024-12-04T02:05:22.277Z"
    },
    {
        category: "UTILITY",
        name: "test222",
        language: "zh_CN",
        status: "REJECTED",
        updateTime: "2024-12-04T02:05:23.277Z"
    },
    {
        category: "UTILITY",
        name: "test222",
        language: "zh_CN",
        status: "REJECTED",
        updateTime: "2024-12-04T02:05:23.277Z"
    },
    {
        category: "UTILITY",
        name: "test333",
        language: "zh_CN",
        status: "REJECTED",
        updateTime: "2024-12-04T02:05:23.277Z"
    },
    {
        category: "UTILITY",
        name: "test444",
        language: "zh_CN",
        status: "REJECTED",
        updateTime: "2024-12-04T02:05:23.277Z"
    },
    {
        category: "UTILITY",
        name: "test555",
        language: "zh_CN",
        status: "REJECTED",
        updateTime: "2024-12-04T02:05:23.277Z"
    }
]);
const filterData = ref([]);

// 賬號選擇
const selectAccount = ref([]);
const accounts = ref([]);

// 搜索欄
const searchContents = ref('');

// 種類
const selectCategory = ref([]);
const category = [
    {value: 'Utility', lang: 'UTILITY'},
    {value: 'Marketing', lang: 'MARKETING'},
    {value: 'Authentication', lang: 'AUTHENTICATION'}
];

// 語言
const selectLanguage = ref([]);
const language = [
    {value: '簡體中文', lang: 'zh_CN'},
    {value: '繁體中文', lang: 'zh_HK'},
    {value: '英文', lang: 'en_US'},
]

// 狀態
const selectStatus = ref([]);
const tempStatus = [
    { value:  'Active - Quality pending'},
    { value:  'Active - High quality'},
    { value:  'Active - Medium quality'},
    { value:  'Active - Low quality'},
    { value:  'In review', lang: "IN REVIEW"},
    { value:  'Rejected', lang: "REJECTED"},
    { value:  'Paused', lang: "PAUSED"},
    { value:  'Disabled', lang: "DISABLED"},
]

// 創建方式
// const selectCreator = ref('');
// const creators = [
//     { value: 'All' },
//     { value: 'API' }
// ]

const formatDate = (date) => {
    const d = new Date(date);

    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');  // 月份从0开始，+1确保月份正确
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const createTemplate = () => {
    console.log("searchContents",searchContents.value)
}

const accountChange = (value) => {

}

const nameChange = (value) => {
    searchContents.value = value;
    dataFilter();
}

const categoryChange = (value) => {
    selectCategory.value = [];
    for(let i in value) {
        category.map(item => {
            if(item.value === value[i]) {
                selectCategory.value.push(item)
            }
        })

    }
    dataFilter();
}

const langChange = (value) => {
    selectLanguage.value = [];
    for(let i in value) {
        language.map(item => {
            if(item.value === value[i]) {
                selectLanguage.value.push(item)
            }
        })
    }
    dataFilter();
}

const statusChange = (value) => {
    selectStatus.value = [];
    for(let i in value) {
        tempStatus.map(item => {
            if(item.value === value[i]) {
                selectStatus.value.push(item)
            }
        })
    }

    dataFilter();
}

const dataFilter = () => {
    let newFilter = []

    if(searchContents.value !== "") {
        newFilter = data.value.filter(item => item.name.includes(searchContents.value));
    }else {
        newFilter = data.value;
    }

    if(selectCategory.value.length !== 0) {
        let selectFilter = [];
        for(let i in selectCategory.value) {
            let result = [];
            result = newFilter.filter(item => item.category === selectCategory.value[i].lang)
            selectFilter = [...selectFilter, ...result];
        }
        newFilter = selectFilter;
    }
    if(selectLanguage.value.length !== 0) {
        let selectFilter = [];
        console.log("selectLanguage.value[i].lang",selectLanguage.value)
        for(let i in selectLanguage.value) {
            let result = [];

            result =  newFilter.filter(item => item.language === selectLanguage.value[i].lang);
            console.log("result",result)
            selectFilter = [...selectFilter, ...result];

        }
        newFilter = selectFilter;
    }

    if(selectStatus.value.length !== 0) {
        let selectFilter = [];
        for(let i in selectStatus.value) {
            let result = [];
            result =  newFilter.filter(item => item.status === selectStatus.value[i].lang)
            selectFilter = [...selectFilter, ...result];
        }
        newFilter = selectFilter;
    }

    filterData.value = newFilter;
}


onBeforeMount(async () => {
    const wabaResponse = await wabaApi.getWABAList();
    if(wabaResponse.status === 200) {
        const result = wabaResponse.data.items;
        result.map(item => {
            accounts.value.push({
                ...item,
                value: item.name
            })

        })
        selectAccount.value.push(accounts.value[0]);
    }

    const response = await templateApi.getTemplateList();
    let result = response.data;
    result.items.map(item => {
        data.value.push(item);
    });
    console.log("itemitemitemitem",data.value)
    // console.log("itemitemitemitem",item)
    dataFilter();
})

</script>

<style scoped>
    .Common {
        padding: 20px;
    }

    .tempSearch {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    .tempList {
        padding: 0 12px;
    }

</style>
