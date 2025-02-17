<template>
    <div>
        <a-modal v-model:open="open" title="客戶信息" @ok="handleOk">
            <div style="min-width: 600px; display: flex; flex-direction: column; padding: 10px">
                <div style="display: flex;flex-direction: column; ">
                    <span style="font-size: 18px">名稱</span>
                    <div style="padding: 12px 0; margin-top: 10px; max-width: 400px">
                        <a-input
                                name="nameInput"
                                v-model:value="headerTxt"
                                style="width: 50%"
                        />
                    </div>

                    <span style="font-size: 18px">電話</span>
                    <div style="padding: 12px 0; margin-top: 10px; max-width: 400px">
                        <a-input-group compact>
                            <a-select v-model:value="value3">
                                <a-select-option value="+852">HK(+852)</a-select-option>
                                <a-select-option value="+1">US(+1)</a-select-option>
                            </a-select>
                            <a-input v-model:value="value4" style="width: 50%" />
                        </a-input-group>
                    </div>

                    <span style="font-size: 18px">地區</span>
                    <div style="padding: 12px 0; margin-top: 10px; max-width: 400px">
                        <a-select
                                v-model:value="value2"
                                :options="options"
                                size="middle"
                                style="width: 200px"
                        ></a-select>
                    </div>

                    <span style="font-size: 18px">電郵</span>
                    <div style="padding: 12px 0; margin-top: 10px; max-width: 400px">
                        <a-input
                                name="nameInput"
                                v-model:value="headerTxt"
                                style="width: 50%"
                        />
                    </div>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const open = ref<boolean>(true);
let headerTxt = ref('');
const value3 = ref<string>('+852');
const value4 = ref<string>('');
const value2 = ref("");

const options = ref([
    { value: "HK", label: "香港" }
]);


const showModal = () => {
    open.value = !open.value
};

const handleOk = (e: MouseEvent) => {
    open.value = false;
};

defineExpose({
    showModal: () => {
        showModal();
    }
})
</script>
