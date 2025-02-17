<template>
    <div>
        <a-modal v-model:open="open" title="客戶信息" @ok="onSubmit" @cancel="resetForm" >
            <a-form
                ref="formRef"
                :model="formState"
                :rules="rules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                style="padding: 10px"
            >
                <a-form-item ref="nickname" label="名稱" name="nickname">
                    <a-input v-model:value="formState.nickname" />
                </a-form-item>
                <a-form-item label="選擇地區" name="countryCode">
                    <a-select v-model:value="formState.countryCode" placeholder="請選擇">
                        <a-select-option value="HK">中國香港</a-select-option>
                        <a-select-option value="CN">中國內地</a-select-option>
                        <a-select-option value="US">美國</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item ref="phoneNumber" label="电话" name="phoneNumber">
                    <a-input v-model:value="formState.phoneNumber" />
                </a-form-item>
                <a-form-item ref="email" label="電郵" name="email">
                    <a-input v-model:value="formState.email" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import {reactive, ref, toRaw, watch} from 'vue';
import type { UnwrapRef } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
const open = ref<boolean>(false);
import {contactApi} from "@/api/ycloud/index.js";

const emits = defineEmits(['createContact'])

interface FormState {
    nickname: string;
    countryCode: string | undefined;
    phoneNumber: string;
    email: string;
}

const formRef = ref();
const labelCol = { span: 5 };
const wrapperCol = { span: 13 };

const formState: UnwrapRef<FormState> = reactive({
    nickname: '',
    countryCode: undefined,
    phoneNumber: '',
    email: '',
});

const options = ref([
    { value: "HK", label: "香港" }
]);

const rules: Record<string, Rule[]> = {
    nickname: [
        { required: true, message: '請填寫名稱', trigger: 'change' },
        { min: 2,  message: '名稱需要大於兩個字', trigger: 'blur' },
    ],
    countryCode: [{ required: true, message: '請選擇地區', trigger: 'change' }],
    phoneNumber: [{ required: true, message: '請填寫電話', trigger: 'change' },]
};
const onSubmit = () => {
    formRef.value
        .validate()
        .then(() => {
            // let result = contactApi.createContact(toRaw(formState));
            emits("createContact", toRaw(formState));
        })
        .catch(error => {
            console.log('error', error);
        });
};
const resetForm = () => {
    formRef.value.resetFields();
};

const showModal = () => {
    open.value = !open.value
};

watch(() => formState.countryCode, (newValue) => {
    formState.phoneNumber = getPhoneHeader(newValue);
})

function getPhoneHeader(region) {
    const phoneHead = {
        "HK": "+852",
        "US": "+1",
        "CN": "+86"
    }

    return phoneHead[region]
}

defineExpose({
    showModal: () => {
        showModal();
    }
})
</script>
