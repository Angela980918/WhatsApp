<template>
  <a-row style="width: 100%;">
    <a-col style="align-self: center;padding: 10px 0" :span="5">
      <a-flex align="center" justify="center">
        <a-avatar size="large" :style="{ backgroundColor: props.color }">{{ avatarText }}</a-avatar>
      </a-flex>
    </a-col>
    <a-col :span="18" style="align-self: center;">
      <a-row style="width: 100%;">
        <a-col :span="12">
          <a-flex justify="flex-star">{{ props.name }}</a-flex>
        </a-col>
        <a-col :span="12">
          <a-flex justify="flex-end">{{ formattedTime || currentTime }}</a-flex>
        </a-col>
        <a-col :span="24" style="padding-top: 3px">
          <a-flex justify="space-between">
            <span class="single-line-text">{{ props.message }}</span>
            <a-badge :count="props.badgeCount"/>
          </a-flex>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import {timeJS} from '@/tools'
import {computed} from "vue";
//传参
const props = defineProps({
  name: {
    type: String,
    default: 'Jacky',
    require: true
  },
  time: {
    type: String,
    require: true
  },
  message: {
    type: String,
    default: '',
  },
  badgeCount: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: '#000'
  }
})

// 随机颜色
// const generateRandomColor = () => {
//   const letters = '0123456789ABCDEF';
//   let color = '#';
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// };

// const avatarColor = generateRandomColor();
// 时间处理格式
const formattedTime = computed(() => {
  return timeJS.formatTime(props.time);
});

// 当前时间
const currentTime = computed(() => {
  return new Date().toISOString();
});

// 获取用户头像的首位字母或字
const getAvatarText = (name: string) => {
  // 使用正则表达式过滤掉数字，只取字母或汉字
  const filteredName = name.replace(/[0-9]/g, '');  // 移除数字
  return filteredName.charAt(0).toUpperCase();  // 获取第一个非数字字母或汉字
};
const avatarText = computed(() => getAvatarText(props.name));
</script>

<style scoped>
.single-line-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
