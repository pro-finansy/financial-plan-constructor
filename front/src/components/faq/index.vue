<template>
  <section class="faq">
    <div class="faq--title flex justify-between items-center">
      <span>FAQ</span>
      <div class="actions flex">
        <label class="search">
          <img
            @click="onSearch"
            src="/images/common/search.svg"
            alt=""
          />
          <input
            type="text"
            v-model="query.search"
            @keyup.enter="onSearch"
            placeholder="Поиск по FAQ..."
          />
        </label>
        <button 
          v-if="staff" 
          @click="modal('faq-add', {})"
          class="btn btn--green"
        >Добавить</button>
      </div>
    </div>
    <div class="faq--container">
      <div class="questions">
        <div 
          class="question"
          v-for="(question, index) of questions" 
          :key="question._id"
        >
          <div class="question--question flex items-center justify-between" @click="question.showed = !question.showed">
            <span>{{ index + 1 }}. {{ question.question }}</span>
            <div class="actions flex items-center">
              <plus v-if="!question.showed" />
              <minus v-else />
              <img v-if="staff" @click.stop="modal('faq-edit', question)" src="/images/common/table/edit.svg" alt="" />
              <img v-if="staff" @click.stop="modal('faq-remove', question)" src="/images/common/table/remove.svg" alt="" />
            </div>
          </div>
          <transition name="fade">
            <div v-if="question.showed" class="question--answer">{{ question.answer }}</div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { dynamicsObject } from "@/interfaces";
import { ACCESSES_ENUM, ROLES_ENUM } from "@/utils/enums";
import { defineComponent } from "vue-demi";
import { mapGetters } from "vuex";
import { Plus, Minus } from '@element-plus/icons';
import { FAQ } from "@/interfaces/dto/faq";

export default defineComponent({
  name: "FAQMain",
  data() {
    return {
      query: {
        search: ''
      },
      questions: [] as Array<FAQ.Dto>
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    this.emits();
  },
  unmounted() {
    this.unemits();
  },
  methods: {
    onSearch() {
      this.getData();
    },
    async getData() {
      const result = await this.API.common.getFAQList(this.query);
      this.questions = result.data;
    },
    modal(id: string, data: dynamicsObject | null) {
      this.$store.commit("createModal", { id, data });
    },
    emits() {
      this.emitter.on("createFAQ", this.createFAQEmitter);
      this.emitter.on("editFAQ", this.editFAQEmitter);
      this.emitter.on("removeFAQ", this.removeFAQEmitter);
    },
    unemits() {
      this.emitter.off("createFAQ", this.createFAQEmitter);
      this.emitter.off("editFAQ", this.editFAQEmitter);
      this.emitter.off("removeFAQ", this.removeFAQEmitter);
    },
    createFAQEmitter(data: FAQ.Dto) {
      this.questions = [...this.questions, data];
    },
    editFAQEmitter(data: FAQ.Dto) {
      const faq = this.questions.find(q => String(q._id) === String(data._id));
      if (faq) {
        faq.question = data.question;
        faq.answer = data.answer;
      }
    },
    removeFAQEmitter(data: string) {
      this.questions = this.questions.filter(q => String(q._id) !== String(data));
    }
  },
  computed: {
    ...mapGetters(['user']),
    staff() {
      const user = this.user as dynamicsObject;
      return user && (user.role === ROLES_ENUM.OWNER || user.accesses.includes(ACCESSES_ENUM.EXPERT));
    }
  },
  components: {
    Plus, Minus
  }
});
</script>

<style lang="scss" scoped>
.faq {
  width: 60%;
  background: #ffffff;
  box-shadow: 2px 2px 10px rgb(0 50 92 / 10%);
  border-radius: 10px;
  padding: 10px 20px;
  margin: 30px auto;
  &--title {
    span {
      font-size: 18px;
      font-weight: 500px;
      letter-spacing: 0.05em;
    }
    label {
      margin-right: 15px;
      position: relative;
      img {
        position: absolute;
        width: 16px;
        top: 9px;
        left: 12px;
        cursor: pointer;
      }
      input {
        width: 250px;
        box-shadow: none;
        font-size: 13px;
        transition: 0.5s all;
        padding: 10px 25px 10px 36px;
      }
    }
  }
  &--container {
    margin-top: 15px;
    .questions {
      .question {
        width: 100%;
        margin: 0 0 1em;
        padding: 15px;
        background-color: #F4F5F9;
        border-radius: 5px;
        &--question {
          cursor: pointer;
          .actions {
            svg {
              width: 20px;
              height: 20px;
            }
            img {
              margin-left: 10px;
            }
          }
        }
        &--answer {
          margin-top: 10px;
          font-size: 14px;
          font-weight: 300;
          white-space: pre-line;
          line-height: 18px;
        }
      }
    }
  }
}
</style>
