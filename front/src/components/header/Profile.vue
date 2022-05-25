<template>
  <div class="profile flex items-center">
    <div class="profile--info">
      <div>{{ user.name || user.email }}</div>
      <div>{{ roleFilter(user) }}</div>
    </div>
    <div class="profile--avatar" v-if="user.role !== 'STUDENT'" @click="$router.push('/profile')">
      <img v-if="user.avatar" loading="lazy" :src="user.avatar.src" alt="">
      <img v-else loading="lazy" src="/images/common/avatar.svg" alt="Avatar" />
    </div>
    <div class="profile--menu flex items-center justify-center" @click="showMenu = !showMenu">
      <svg :class="{active: showMenu}" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="451.847px" height="451.847px" viewBox="0 0 451.847 451.847" style="enable-background:new 0 0 451.847 451.847;" xml:space="preserve">
        <path d="M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751 c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0 c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z"/>
      </svg>
      <transition name="fade">
        <div v-if="showMenu" class="drop">
          <ul>
            <router-link
              :to="element.link"
              v-for="element of navigation"
              :key="element.link"
              custom
              v-slot="{ navigate, isExactActive}"
            >
              <li v-if="element.access || staff" :class="{active: isExactActive}" @click="navigate">
                <component :is="element.icon"></component>
                <span>{{ element.name }}</span>
              </li>
            </router-link>
            <li @click="$store.dispatch('logout')">
              <switch-button />
              <span>Выход</span>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, markRaw } from "vue-demi";
import { Avatar, Document, Service, SwitchButton, Tools, Money, PieChart, QuestionFilled, UserFilled } from '@element-plus/icons';
import roleFilter from "@/filters/role.filter";
import { ACCESSES_ENUM, ROLES_ENUM } from '@/utils/enums';
import { User } from "@/interfaces/dto/user";

export default defineComponent({
  name: "Profile",
  props: {
    user: {
      type: Object as PropType<User.Dto>,
      required: true
    }
  },
  data() {
    return {
      navigation: [
        { link: '/profile', name: 'Профиль', icon: markRaw(Avatar), access: true },
        { link: '/faq', name: 'FAQ', icon: markRaw(QuestionFilled), access: false },
        { link: '/support', name: 'Список СП', icon: markRaw(Service), access: false },
        { link: '/experts', name: 'Список экспертов', icon: markRaw(UserFilled), access: false },
        { link: '/questionnaires', name: 'Анкеты', icon: markRaw(Document), access: false },
        { link: '/questionnaires/archive', name: 'Архив анкет', icon: markRaw(Document), access: false },
        { link: '/assets', name: 'Смешанные активы', icon: markRaw(PieChart), access: false },
        { link: '/currencies', name: 'Валюты', icon: markRaw(Money), access: false },
        { link: '/instruments', name: 'Инструменты', icon: markRaw(Tools), access: false },
      ],
      showMenu: false,
      courseElement: null
    }
  },
  created() {
    this.navigation[1].access = this.faqAccess
    if (this.user.role === ROLES_ENUM.STUDENT) this.getCourseElement();
  },
  computed: {
    staff() {
      return this.user && (this.user.accesses.includes(ACCESSES_ENUM.EXPERT) || this.user.role === ROLES_ENUM.OWNER);
    },
    faqAccess() {
      return this.user && (this.user.role !== ROLES_ENUM.STUDENT);
    }
  },
  methods: {
    roleFilter,
    async getCourseElement() {
      const result = await this.API.student.getCourseElement(this.user._id);
      this.courseElement = result.data;
    },
  },
  components: {
    Avatar, Document, Service, SwitchButton, Tools, Money, PieChart, QuestionFilled, UserFilled
  }
})
</script>

<style lang="scss" scoped>
.profile {
  &--actions {
    padding-right: 40px;
  }
  &--info {
    text-align: right;
    div:last-child {
      color: #7d8e9e;
      font-size: 12px;
    }
  }
  &--avatar {
    cursor: pointer;
    margin: 0 10px 0 15px;
    width: 55px;
    height: 55px;
    img {
      width: inherit;
      height: inherit;
      border-radius: 10px;
      object-fit: cover;
    }
  }
  &--menu {
    width: 30px;
    height: 30px;
    cursor: pointer;
    position: relative;
    svg {
      width: 15px;
      height: 15px;
      transition: .3s all;
      &.active {
        transition: .3s all;
        transform: rotate(180deg);
      }
    }
    .drop {
      width: 200px;
      background-color: #fff;
      border-radius: 0 0 10px 10px;
      position: absolute;
      box-shadow: 0 1px 2px #d4d4d4;
      top: 53px;
      right: 0;
      z-index: 1;
      ul {
        li {
          display: flex;
          align-items: center;
          padding: 8px 15px;
          cursor: pointer;
          font-size: 14px;
          color: #474747;
          transition: all 0.3s;
          span {
            margin-left: 12px;
          }
          &:hover {
            color: #222222;
            background-color: #fafafa;
            transition: all 0.3s;
          }
          &:not(:last-child) {
            border-bottom: 1px solid #f3f3f3;
          }
          &:last-child {
            border-radius: 0 0 10px 10px;
          }
          &.active {
            background-color: #f5f5f5;
          }
        }
      }
    }
  }
}
</style>