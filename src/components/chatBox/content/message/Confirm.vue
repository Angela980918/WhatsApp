<template>
    <div>
        <a-modal style="top: 40%" title="確認" v-model:open="open" @ok="handleSubmit" ok-text="發送" cancel-text="取消" >
            <p>是否發送 {{props.msgName}} {{props.msgType}}</p>
        </a-modal>
    </div>
</template>

<script lang="ts" setup>
import {defineEmits, ref} from 'vue';
const emits = defineEmits(['sendMsg'])
const props = defineProps({
    msgName: {
        type: String,
        default: "此"
    },
    msgType: {
        type: String,
        default: "消息"
    }
})

const open = ref<boolean>(false);

const handleSubmit = () => {
    open.value = !open.value
    emits('sendMsg')
}
const showModal = () => {
    open.value = true;
};

defineExpose({
    showModal: () => {
        showModal();
    },
})

</script>

<style scoped>

</style>
