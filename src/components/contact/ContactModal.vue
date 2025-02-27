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
import type { Rule } from 'ant-design-vue/es/form';

const open = ref<boolean>(false);
const props = defineProps({
    formData: {
        type: Object,
        default: {},
    },
    isCreate: {
        type: Boolean,
        default: true
    },
});

// 创建 or 更新
const createVal = ref(props.isCreate);
const emits = defineEmits(['createContact','updateContact']);

const formRef = ref();

const options = ref([
    { value: "HK", label: "香港" }
]);

// 表單
const labelCol = { span: 5 };
const wrapperCol = { span: 13 };

let formState = reactive({
    nickname: '',
    countryCode: undefined,
    phoneNumber: '',
    email: '',
});

const rules: Record<string, Rule[]> = {
    nickname: [
        { required: true, message: '請填寫名稱', trigger: 'change' },
        { min: 2,  message: '名稱需要大於兩個字', trigger: 'blur' },
    ],
    countryCode: [{ required: true, message: '請選擇地區', trigger: 'change' }],
    phoneNumber: [{ required: true, message: '請填寫電話', trigger: 'change' },]
};

function getPhoneHeader(region) {
    const phoneHead = {
        "HK": "+852",
        "US": "+1",
        "CN": "+86"
    }
    return phoneHead[region]
}

// 提交
const onSubmit = () => {
    formRef.value
        .validate()
        .then(() => {
            if(createVal.value) {
                emits('createContact', toRaw(formState));
                resetForm();
            }else {
                emits('updateContact', toRaw(formState));
                resetForm();
            }
        })
        .catch(error => {
            console.log('error', error);
        });
};

// 移除
const resetForm = () => {
    formRef.value.resetFields();
};

const showModal = () => {
    open.value = !open.value
};

watch(() => formState.countryCode, (newValue) => {
    if(createVal.value) {
        formState.phoneNumber = getPhoneHeader(newValue);
    }
})

watch(() => props.formData, (newValue) => {
    Object.assign(formState, newValue);
}, { deep: true })

watch(() => props.isCreate, (newValue) => {
    createVal.value = newValue;
},{ deep: true })

defineExpose({
    showModal: () => {
        showModal();
    }
})
</script>
