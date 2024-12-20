<template>
    <div>
        <a-modal v-model:open="open" title="選擇模板" k-text="確認" cancel-text="取消" @ok="handleSubmit">
            <div v-for="item in tempList">
                <div style="display: flex; flex-direction: row;">
                    <span>{{ item.name }}</span>
                    <span>{{ item.language }}</span>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";

interface DataItem {
    key: string;
    name: string;
    language: number;
}

const columns = [
    {
        title: 'name',
        dataIndex: 'name',
        width: '30%',
    },
    {
        title: 'language',
        dataIndex: 'language',
    },
    {
        title: 'operation',
        dataIndex: 'operation',
    },
];

let open = ref(false);
let tempList = [
    { name: 'test002', language: 'zh_HK'},
    { name: 'test1211', language: 'zh_HK'},
    { name: 'test001', language: 'zh_HK'},
    { name: 'test_1205', language: 'zh_HK'},
]
const handleSubmit = () => {
    open.value = !open.value
}



defineExpose({
    controlTemp: () => {
        console.log("4444444")
        handleSubmit();
    }
})




</script>

<style scoped>

</style>
