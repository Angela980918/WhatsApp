
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
                :data-source="data"
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

const data = ref([]);
const filterData = ref([]);

// 賬號選擇
const selectAccount = ref([]);
const accounts = [
    {
        value: "datas1"
    },
    {
        value: "datas2"
    },
    {
        value: "datas3"
    }
];

// 搜索欄
const searchContents = ref();

// 種類
const selectCategory = ref([]);
const category = [
    { value: 'All', kind: 'category' },
    { value: 'Utility', kind: 'category' },
    { value: 'Marketing', kind: 'category' },
    { value: 'Authentication', kind: 'category' }
];

// 語言
const selectLanguage = ref([]);
const language = [
    { value: 'All', kind: 'language' },
    { value: 'Chinese (CHN)', lang: 'zh_CN', kind: 'language'  },
    { value: 'Chinese (HKG)', lang: 'zh_HK', kind: 'language'  },
    { value: 'English', lang: 'en', kind: 'language'  },
]

// 狀態
const selectStatus = ref([]);
const tempStatus = [
    { value:  'Active - Quality pending', kind: 'status'},
    { value:  'Active - High quality', kind: 'status'},
    { value:  'Active - Medium quality', kind: 'status'},
    { value:  'Active - Low quality', kind: 'status'},
    { value:  'In review', kind: 'status'},
    { value:  'Rejected', kind: 'status'},
    { value:  'Paused', kind: 'status'},
    { value:  'Disabled', kind: 'status'},
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

    for(let i in value) {
        category.map(item => {
            if(item.value === i) {
                selectCategory.value.push(item)
            }
        })

    }
    dataFilter();
}

const langChange = (value) => {

    for(let i in value) {
        language.map(item => {
            if(item.value === i) {
                selectLanguage.value.push(item)
            }
        })
    }
    console.log("value",value)
    dataFilter();
}

const statusChange = (value) => {

    for(let i in value) {
        tempStatus.map(item => {
            if(item.value === i) {
                selectStatus.value.push(item)
            }
        })
    }

    dataFilter();
}

const dataFilter = () => {
    let newFilter = []

    if(searchContents.value !== "") {
        newFilter = data.value.map(item => item.name.includes(searchContents.value));
    }else {
        newFilter = data.value;
    }

    if(selectCategory.value.length !== 0) {
        for(let i in value) {
            newFilter =  newFilter.value.map(item => item.category === i)
        }
    }

    if(selectLanguage.value.length !== 0) {
        for(let i in value) {
            newFilter =  newFilter.value.map(item => item.language === i)
        }
    }

    if(selectStatus.value.length !== 0) {
        for(let i in value) {
            newFilter =  newFilter.value.map(item => item.status === i)
        }
    }

    filterData.value = newFilter;
}


// onBeforeMount(async () => {
//     const response = await templateApi.getTemplateList();
//     let result = response.data;
//     result.items.map(item => {
//         data.value.push(item);
//     });
// })

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
