<template>
  <div>
    <!-- 头像预览 -->
    <img v-if="previewUrl" :src="previewUrl" alt="Avatar Preview" class="avatar-preview" />

    <!-- 上传按钮 -->
    <input type="file" @change="handleFileChange" accept="image/*" />

    <!-- 提交按钮 -->
    <button @click="uploadImage">上传头像</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const selectedFile = ref(null);
const previewUrl = ref("");

// 处理用户选择的文件
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;

    // 在前端预览图片
    const reader = new FileReader();
    reader.onload = () => {
      previewUrl.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

const uploadImage = async () => {
  if (!selectedFile.value) {
    alert("请先选择图片！");
    return;
  }

  const formData = new FormData();
  formData.append("avatar", selectedFile.value);

  try {
    const response = await axios.post("/user/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("上传成功！");

    console.log(response)
  } catch (error) {
    console.error("上传失败", error);
    alert("上传失败！");
  }
};

definePageMeta({
  layout: false
})
</script>

<style>
.avatar-preview {
  margin-top: 60px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
