<template>
    <div>
        <a-modal v-model:open="open" title="创建用户" k-text="确认" cancel-text="取消" @ok="handleSubmit">
            <a-form
                :model="form"
                :rules="rules"

                ref="formRef"
                @submit.prevent="handleSubmit"
            >
                <a-form-item label="客戶名" name="username">
                    <a-input v-model:value="form.username" placeholder="請輸入名稱" />
                </a-form-item>

                <a-form-item label="電話" name="phone">
                    <a-select >
                        <a-select-option value="+86">+86</a-select-option>
                        <a-select-option value="+852">+852</a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item name="phone">
                    <a-input />
                </a-form-item>

                <a-form-item label="擁有者" name="owner">
                    <a-select >
                        <a-select-option value="+86">+86</a-select-option>
                        <a-select-option value="+852">+852</a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="電郵地址" name="email">
                    <a-input style="width: 80%" />
                </a-form-item>

<!--                <a-form-item label="tags" name="email">-->
<!--                    <a-select >-->
<!--                        <a-select-option value="+86">+86</a-select-option>-->
<!--                        <a-select-option value="+852">+852</a-select-option>-->
<!--                    </a-select>-->
<!--                </a-form-item>-->
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>
import {ref} from "vue";

const open = ref(true);

const setOpen = () => {
    open.value = !open.value
}

const form = ref({
    username: '',
    password: '',
});

const rules = ref({
    username: [
        { required: true, message: '用户名是必填项', trigger: 'blur' },
        { min: 3, max: 15, message: '用户名长度必须在 3 到 15 个字符之间', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '密码是必填项', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur' },
    ],
});

const formRef = ref();

const handleSubmit = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            // console.log('提交成功', form.value);
        } else {
            console.error('验证失败');
        }
    });
};

defineExpose({
    setOpen: () => {
        setOpen();
    }
})

</script>

<style scoped>

</style>
