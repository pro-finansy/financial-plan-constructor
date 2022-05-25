<template>
  <header class="flex justify-between items-center">
    <div class="title">{{ data.content.title }}</div>
    <label>
      <input type="file" name="avatar" ref="file" @change="uploadFile" />
      <div
        v-if="data.content.method !== 'delete' && data.content.upload_request"
        class="upload flex justify-center items-center"
        :class="{ uu: preview_avatar || data.inputs.data.avatar }"
      >
        <img
          class="avatar"
          v-if="preview_avatar"
          :src="preview_avatar"
          alt=""
        />
        <img
          class="avatar"
          v-else-if="!preview_avatar && data.inputs.data.avatar"
          :src="data.inputs.data.avatar"
          alt=""
        />
        <img
          v-else
          src="/images/common/modal/upload.svg"
          loading="lazy"
          alt=""
        />
      </div>
    </label>
  </header>
</template>

<script lang="ts">
import { ERROR_UPLOAD_FILE, ERROR_UPLOAD_FILE_TYPE_IMAGE } from "@/utils/constants";
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "ModalHeader",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      preview_avatar: null,
    };
  },
  methods: {
    uploadFile() {
      const file = (this.$refs.file as any).files[0];
      this.data.inputs.data.upload = file;
      if (!file)
        return this.$store.commit("createNotification", {
          status: "error",
          message: ERROR_UPLOAD_FILE,
        });
      if (
        !(
          file.type.includes("jpeg") ||
          file.type.includes("png") ||
          file.type.includes("webp")
        )
      ) {
        return this.$store.commit("createNotification", {
          status: "error",
          message: ERROR_UPLOAD_FILE_TYPE_IMAGE,
        });
      }
      const img = new Image();
      img.onload = () => {
        let fr = new FileReader();
        fr.onload = (() => {
          return (e: any) => {
            this.preview_avatar = e.target.result;
          };
        })();
        fr.readAsDataURL(file);
      };
      img.src = URL.createObjectURL(file);
    },
  },
});
</script>

<style lang="scss" scoped>
header {
  margin-bottom: 20px;
  padding: 0 25px;
  .title {
    color: #292929;
    font-size: 20px;
    letter-spacing: 0.03em;
  }
  .upload {
    width: 60px;
    height: 60px;
    border: 2px dashed #7d8e9e;
    box-sizing: border-box;
    border-radius: 10px;
    cursor: pointer;
    &.uu {
      border: none;
    }
    .avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 10px;
    }
  }
}
</style>