<template>
  <ADrawer
      title="客戶資料"
      placement="right"
      :visible="visible"
      @close="onClose"
      width="500"
  >
    <template v-if="currentRecord">
      <!-- 昵稱 -->
      <div class="drawer-item">
        <AFlex align="center" gap="small">
          <a-input
              v-model:value="currentRecord.nickname"
              :disabled="!editStates.nickname"
              :style="{ width: '200px' }"
              @blur="handleBlur('nickname')"
              maxlength="30"
          />
          <a-tooltip title="複製">
            <a-button
                @click="handleCopy(currentRecord.nickname)"
                :icon="h(CopyOutlined)"
                type="primary"
            ></a-button>
          </a-tooltip>
          <a-tooltip :title="editStates.nickname ? '保存' : '修改'">
            <a-button
                @click="toggleEdit('nickname')"
                type="primary"
                @mousedown="handleMouseDown"
                :icon="editStates.nickname ? h(SaveOutlined) : h(EditOutlined)"
            ></a-button>
          </a-tooltip>
        </AFlex>
      </div>

      <!-- 其他字段 -->
      <p><strong>歸屬郵箱:</strong> {{ currentRecord.ownerEmail }}</p>
      <p><strong>國家/地區:</strong> {{ getCountryLabel(currentRecord.countryCode) }}</p>
      <p><strong>電子郵件:</strong> {{ currentRecord.email }}</p>
      <p><strong>電話號碼:</strong> {{ currentRecord.phoneNumber }}</p>
      <p><strong>創建時間:</strong> {{ currentRecord.createTime }}</p>
      <p><strong>最后聯絡時間:</strong> {{ currentRecord.lastSeen }}</p>
      <p><strong>會話標簽:</strong></p>
      <div>
        <a-tag
            v-for="tag in currentRecord.tags"
            :key="tag"
            :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
        >
          {{ tag.toUpperCase() }}
        </a-tag>
      </div>
    </template>
  </ADrawer>
</template>

<script lang="ts" setup>
import { ref, reactive, h } from 'vue';
import { message } from 'ant-design-vue';
import { CopyOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons-vue';
import { getCountryLabel } from '@/map/index.js';

interface Props {
  visible: boolean;
  currentRecord: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['close']);

// 控制每个字段的编辑状态
const editStates = reactive({
  nickname: false,
});

// 保存字段的原始值
const originalValues = reactive({
  nickname: '',
});

// 复制内容到剪贴板
const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    message.success('复制成功');
  });
};

// 切换编辑状态
const toggleEdit = (field: keyof typeof editStates) => {
  console.log('toggleEdit', field);
  if (editStates[field]) {
    console.log('if',editStates[field]);
    // 如果当前是编辑模式，点击按钮表示保存
    handleSave(field);
  } else {
    console.log('else',editStates[field]);
    // 如果当前是非编辑模式，点击按钮表示进入编辑模式
    originalValues[field] = props.currentRecord[field]; // 保存原始值
    editStates[field] = true; // 进入编辑模式
  }
};

// 保存逻辑
const handleSave = (field: keyof typeof editStates) => {
  message.success('保存成功');
  editStates[field] = false; // 退出编辑模式
};

// 处理鼠标按下事件
const handleMouseDown = (event: MouseEvent) => {
event.preventDefault(); // 阻止默认行为，避免触发 blur 事件
};


// 处理输入框失焦事件
const handleBlur = (field: keyof typeof editStates) => {
  if (editStates[field]) {
    // 如果处于编辑模式，且用户没有点击保存，则恢复原始值
    props.currentRecord[field] = originalValues[field];
    editStates[field] = false; // 切换回禁用模式
  }
};

// 关闭 Drawer
const onClose = () => {
  emit('close');
};
</script>

<style scoped>
.drawer-item {
  margin-bottom: 16px;
}
</style>