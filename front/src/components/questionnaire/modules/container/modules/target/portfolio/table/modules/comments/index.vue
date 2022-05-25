<template>
  <div class="comments">
    <div class="comments--title flex items-center justify-between" :class="portfolioId">
      <span>Комментарии к портфелю</span>
    </div>
    <div class="comments--container flex wrap-wrap justify-between">
      <div class="comment" v-for="comment of comments" :class="{one: comments.length === 1}" :key="comment.modules[0].inputs[0].id">
        <div class="comment--title flex items-center">
          <span>{{ comment.name }}</span>
          <button v-if="comment.default !== 'conclusion-student-comment' && portfolioId === 'studentPortfolio'" @click="fromComment(comment.default)" class="btn">Обратно</button>
          <button v-if="comment.default === 'conclusion-comment' && portfolioId !== 'studentPortfolio'" @click="fromComment('stock-comment')" class="btn" :class="portfolioId">Обратно</button>
        </div>
        <div class="comment--container">
          <div v-if="comment.default === 'conclusion-student-comment'" class="textarea">
            {{ comment.modules[0].data[comment.modules[0].inputs[0].id] }}
          </div>
          <textarea v-else :placeholder="comment.modules[0].inputs[0].placeholder" v-model="comment.modules[0].data[comment.modules[0].inputs[0].id]"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import { Questionnaire } from "@/interfaces/dto/questionnaire";

export default defineComponent({
  name: 'PortfolioComments',
  props: {
    portfolio: {
      type: Object as PropType<Questionnaire.QTargetPortfolio>,
      required: true
    },
    course: {
      type: String,
      required: true
    },
    target: {
      type: Object,
      required: true
    },
    portfolioId: {
      type: String,
      required: true,
    },
  },
  computed: {
    comments() {
      return this.portfolio.sections.filter(s => s.default.includes('-comment'));
    }
  },
  methods: {
    fromComment(from: string) {
      const offset = this.jq(`table[data-id="${from.replace('-comment', '')}"]`).offset() || { top: 150 };
      this.jq('html, body').animate({ scrollTop: offset.top - 150 }, 400);
    }
  }
})
</script>

<style lang="scss" scoped>
.comments {
  margin-top: 20px;
  &--title {
    padding: 15px 30px;
    border-radius: 5px 5px 0 0;
    span {
      color: #fff;
    }
    &.studentPortfolio {
      background: #74b2e6;
    }
    &.existingPortfolio {
      background: #71be67;
    }
    &.expertPortfolio {
      background: #ec8b51;
    }
  }
  &--container {
    background-color: #fff;
    padding: 30px;
    .comment {
      width: 48%;
      margin-bottom: 20px;
      &.one {
        width: 100%;
        .comment--container {
          textarea {
            height: 350px;
          }
        }
      }
      &--title {
        height: 40px;
        button {
          margin-left: 10px;
          background: #74b2e6;
          padding: 8px 10px;
          font-size: 10px;
          &.existingPortfolio {
            background: #71be67;
          }
          &.expertPortfolio {
            background: #ec8b51;
          }
        }
      }
      &--container {
        textarea, .textarea {
          padding: 10px 15px;
          font-size: 14px;
          height: 150px;
          font-size: 14px;
          font-weight: 500;
          box-shadow: inset 1px 1px 5px rgba(166, 171, 189, 0.3);
          border-radius: 8px;
          transition: 0.3s all;
        }
      }
    }
  }
}
</style>