<template>
  <section class="edit flex wrap-wrap" :class="{'justify-center': student}">
    <div class="profile settings" :class="{student: student}">
      <div class="profile--title">Настройки профиля</div>
      <div class="profile--container flex">
        <div class="left" v-if="user && user.role === 'EXPERT'">
          <div class="avatar">
            <img loading="lazy" v-if="preview_avatar && !deleteAvatar" :src="preview_avatar" alt="">
            <img loading="lazy" v-else-if="user && user.avatar && !preview_avatar && !deleteAvatar" :src="user.avatar.src" alt="">
            <img v-else src="/images/common/avatar.svg" alt="">
            <div class="description">
              <span>Рекомендовано (615x884) (jpeg, jpg, webp)</span>
            </div>
            <div class="actions flex justify-between">
              <label>
                <input type="file" name="avatar" ref="avatar" @change="uploadFile">
                <div class="btn btn--green">Добавить</div>
              </label>
              <div class="btn btn--orange" @click="onDeleteAvatar">Удалить</div>
            </div>
          </div>
        </div>
        <div class="right flex direction-column items-end">
          <inputs 
            :module="module" 
            :datas="[]"
          ></inputs>
          <label class="chat flex items-center">
            <input type="checkbox" v-model="module.data.showChat">
            <span>Отображать информацию по чату в итоговом отчёте</span>
          </label>
          <div class="btn btn--green" @click="updateProfile">Сохранить</div>
        </div>
      </div>
    </div>
    <password v-if="student || support" :user="user" />
    <courses :user="user" />
    <profile-comments v-if="expert" :user="user"></profile-comments>
  </section>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue-demi';
import { mapGetters } from 'vuex';

import { COURSES_ENUM, ROLES_ENUM } from '@/utils/enums';
import Inputs from '@/components/common/inputs/index.vue';
import { dynamicsObject } from '@/interfaces';
import { PROFILE_INPUTS } from './constants';
import { ERROR_UPLOAD_FILE, ERROR_UPLOAD_FILE_TYPE_IMAGE } from '@/utils/constants';

const courses = defineAsyncComponent(() => import ('./modules/courses.vue'));
const profileComments = defineAsyncComponent(() => import ('./modules/comments.vue'));
const Password = defineAsyncComponent(() => import ('./modules/password.vue'));

export default defineComponent({
  name: 'ProfileMain',
  data() {
    return {
      module: {
        data: {} as dynamicsObject,
        inputs: PROFILE_INPUTS
      },
      preview_avatar: null,
      file: '',
      deleteAvatar: false,
    }
  },
  created() {
    const variables = ['name', 'phone', 'times', 'days', 'dayLength', 'showChat'];
    for (const variable of variables) {
      this.module.data[variable] = this.user[variable];
    }
    if (this.user && this.user.role && (this.user.role === ROLES_ENUM.STUDENT || this.user.role === ROLES_ENUM.SUPPORT)) {
      this.module.inputs = [
        { id: 'name', placeholder: 'ФИО', name: 'ФИО', grid: '1 / 10', type: 'text', drop: false, error: false, required: false, show: true },
        { id: 'phone', placeholder: '+71234567890', name: 'Телефон', mask: '+############', grid: '1 / 10', type: 'phone', drop: false, error: false, required: false, show: true },
      ]
    }
  },
  computed: {
    ...mapGetters(['user', 'Authorization']),
    expert() {
      const user = this.user as dynamicsObject;
      return user && user.role === ROLES_ENUM.EXPERT;
    },
    student() {
      const user = this.user as dynamicsObject;
      return user && user.role === ROLES_ENUM.STUDENT;
    },
    support() {
      const user = this.user as dynamicsObject;
      return user && user.role === ROLES_ENUM.SUPPORT;
    },
    staff() {
      const user = this.user as dynamicsObject;
      return user && user.role === ROLES_ENUM.OWNER || user.accesses.includes(ROLES_ENUM.EXPERT)
    }
  },
  methods: {
    async updateProfile() {
      const result = await this.API.user.updateProfile(this.module.data);
      if (this.file) this.updateAvatar();
      if (this.deleteAvatar) this.removeAvatar();
      this.$store.commit('updateUser', result.data);
    },
    async updateAvatar() {
      const formData = new FormData();
      formData.append("avatar", this.file);
      formData.append("_id", this.user._id);
      const result = await this.API.user.updateAvatar(formData, { _id: this.user._id });
      this.$store.commit('updateUserModel', result.data);
    },
    async removeAvatar() {
      const result = await this.API.user.removeAvatar(this.user._id);
      this.$store.commit('updateUser', result.data);
    },
    onDeleteAvatar() {
      this.deleteAvatar = true;
      this.file = '';
      this.preview_avatar = null;
      this.user.avatar = null;
      (this.$refs.avatar as HTMLInputElement).files = null;
    },
    uploadFile() {
      const file = (this.$refs.avatar as any).files[0];
      this.deleteAvatar = false;
      this.file = file;
      if (!file)
        return this.$store.commit("createNotification", { status: 'error', message: ERROR_UPLOAD_FILE });
      if (!(file.type.includes("jpeg") || file.type.includes("png") || file.type.includes("webp")))
        return this.$store.commit("createNotification", { status: 'error', message: ERROR_UPLOAD_FILE_TYPE_IMAGE });
      
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
  components: {
    Inputs,
    courses,
    profileComments,
    Password
}
})
</script>

<style lang="scss" scoped>
.edit {
  width: 80%;
  margin: 0 auto;
  padding: 30px;
  .profile {
    width: 70%;
    background: #ffffff;
    border-radius: 10px;
    padding: 25px;
    &.settings {
      margin-right: 30px;
    }
    &.student {
      width: 51%;
      margin-right: 0;
      justify-content: center;
    }
    &--title {
      font-weight: 500;
      font-size: 24px;
    }
    &--container {
      margin-top: 20px;
      .left {
        min-width: 300px;
        .avatar {
          border-radius: 15px;
          width: 90%;
          img {
            border-radius: 15px;
            width: 270px;
            height: 342px;
            object-fit: cover;
          }
          .description {
            margin-top: 10px;
            span {
              font-size: 12px;
              color: #292929;
            }
          }
          .actions {
            margin-top: 15px;
          }
        }
      }
      .right {
        flex-grow: 1;
        .inputs {
          width: 100%;
          margin-bottom: 15px;
        }
        .chat {
          align-self: start;
          cursor: pointer;
          span {
            font-size: 14px;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>