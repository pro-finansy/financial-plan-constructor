<template>
  <section class="users clearfix" :class="questionnaire">
    <div class="left">
      <div class="top">Обучающийся</div>
      <div class="container">
        <div>{{ student.name }}</div>
        <div>{{ student.phone }}</div>
        <div>{{ student.email }}</div>
        <div v-if="student.currency && questionnaire === COURSES_ENUM.ONE">
          <strong>Валюта текущего дохода:</strong>{{ student.currency }}
        </div>
        <div>
          <strong>Страна налогового резидентства:</strong>{{ student.country }}
        </div>
        <div><strong>Cтатус госслужащего:</strong>{{ student.role }}</div>
        <div v-if="student.role === 'Да'">
          Вы указали, что являетесь госслужащим. Пожалуйста, ознакомьтесь с
          файлом «Особенности инвестирования для госслужащих», который мы
          присылали в чат. С помощью него вы сможете точно определиться, какие у
          вас есть возможности и ограничения в инвестировании. Посмотрите
          дополнительно видео Ольги в Инстаграм «Инвестиции для госслужащих» -
          <a
            style="color: rgb(0, 89, 255)"
            href="https://www.instagram.com/p/CKgdcyoj4Nc/"
            target="_blank"
            >https://www.instagram.com/p/CKgdcyoj4Nc/</a
          >
          <br /><br /><span v-if="questionnaire === COURSES_ENUM.ONE"
            >Вашу работу я проверяю исходя из предположения, что вам нельзя
            открывать счет и покупать активы у зарубежного брокера.</span
          >
        </div>
      </div>
    </div>
    <div class="right">
      <div class="left">
        <div class="top">Проверяющий</div>
        <div class="container">
          <div v-if="questionnaire === COURSES_ENUM.ONE">
            Эксперт курса «Капитал: инвестируем валюту»
          </div>
          <div v-if="questionnaire === COURSES_ENUM.TWO">
            Эксперт курса «Я - Инвестор 2.0»
          </div>
          <div>{{ expert.name }}</div>
          <div style="font-variant: lining-nums">{{ expert.phone }}</div>
          <div v-if="questionnaire === COURSES_ENUM.TWO">{{ expert.email }}</div>
          <div v-if="questionnaire === COURSES_ENUM.TWO && expert.showChat">
            Учебный чат будет снова открыт для обсуждений на
            {{ expert.dayLength }}
            {{
              correctDescription({
                term: expert.dayLength,
                duration_id: "DAYS",
              })
            }}:
            <br />
            <strong>{{ expert.days }} включительно</strong>
          </div>
          <div v-if="questionnaire === COURSES_ENUM.TWO && expert.showChat">
            Время работы чата: <br /><strong>{{ expert.times }}</strong
            >по мск. времени
          </div>
          <div v-else style="width: 200px; height: 20px;"></div>
          <div v-if="questionnaire === COURSES_ENUM.ONE && expert.showChat">
            Учебный чат снова откроется {{ expert.days }}, время работы
            {{ expert.times }} по мск. времени
          </div>
          <div
            v-else-if="questionnaire === COURSES_ENUM.ONE"
            style="height: 39px; width: 200px"
          ></div>
        </div>
      </div>
      <div class="right">
        <img
          v-if="expert.avatar"
          style="width: 140px"
          :src="expert.avatar.src"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import correctDescription from "@/utils/correctEnd";
import { COURSES_ENUM } from "@/utils/enums";

export default defineComponent({
  name: "CommonQuestionnaireTemplateUsers",
  props: ["expert", "student", "questionnaire"],
  data() {
    return {
      COURSES_ENUM: COURSES_ENUM,
    };
  },
  methods: {
    correctDescription,
  },
});
</script>

<style lang="scss" scoped>
.users {
  display: block;
  > .left,
  > .right {
    width: 48%;
    .top {
      font-weight: 800;
      font-size: 18px;
      margin-bottom: 12px;
    }
    .container div {
      font-size: 12px;
      margin-bottom: 10px;
      font-weight: 400;
      > span {
        font-weight: 500;
      }
      strong {
        margin-right: 10px;
      }
    }
  }
  > .right {
    position: relative;
    width: 48%;
    border-bottom: 2px solid #02724a;
    > .left {
      width: 200px;
    }
    > .right {
      position: absolute;
      bottom: -1px;
      right: 0px;
    }
  }
  &.two {
    > .right {
      border-bottom-color: #000;
    }
  }
}

.left {
  float: left;
}

.right {
  float: right;
}

/* clearfix */
.clearfix:before,
.clearfix:after {
  content: " ";
  display: table;
}

.clearfix:after {
  clear: both;
}

.clearfix {
  *zoom: 1;
}
</style>
