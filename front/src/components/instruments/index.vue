<template>
  <div class="instruments">
    <div class="instruments--title flex justify-between items-center">
      <span>Инструменты</span>
      <div class="actions flex">
        <div class="courses">
          <button @click="selectCourse(COURSES_ENUM.ONE)" :class="{selected: query.course === COURSES_ENUM.ONE}" class="btn btn--left">Капитал</button>
          <button @click="selectCourse(COURSES_ENUM.TWO)" :class="{selected: query.course === COURSES_ENUM.TWO}" class="btn btn--right">Я - Инвестор</button>
        </div>
        <label class="search">
          <img
            @click="search"
            src="/images/common/search.svg"
            alt=""
            data-v-6f62cbbe=""
          />
          <input
            type="text"
            v-model="query.name"
            @keyup.enter="search"
            placeholder="Поиск по активу..."
          />
        </label>
        <button
          class="btn btn--green"
          @click="modal('common_instrument-create', { course: query.course })"
        >
          Добавить
        </button>
      </div>
    </div>
    <div class="instruments--container">
      <table>
        <thead>
          <tr>
            <th style="width: 8%">Наименование</th>
            <th style="width: 8%">Тикер/ISIN</th>
            <th style="width: 8%">Цена</th>
            <th style="width: 8%">Валюта</th>
            <th style="width: 8%">Валюта для диверс.</th>
            <th style="width: 8%">Класс</th>
            <th style="width: 8%">Тип</th>
            <th style="width: 8%">Страна</th>
            <th style="width: 8%">Сектор</th>
            <th style="width: 8%">Кол-во комментариев</th>
            <th style="width: 8%; text-align: center">Фиксация</th>
            <th style="width: 6%"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="instrument of instruments" :key="instrument._id">
            <td v-for="variable of variables" :key="variable">
              <div class="col">{{ instrument[variable] }}</div>
            </td>
            <td class="blocked">
              <input
                type="checkbox"
                @change="onBlockedInstrument(instrument)"
                v-model="instrument.blocked"
              />
            </td>
            <td class="actions">
              <div>
                <div
                  class="edit"
                  @click="modal(`common_instrument-edit`, {...instrument, course: query.course})"
                >
                  <img src="/images/common/table/edit.svg" alt="" />
                </div>
                <div @click="modal(`common_instrument-remove`, {...instrument, course: query.course})">
                  <img src="/images/common/table/remove.svg" alt="" />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <pagination :query="query" :total="total" @selectPage="page"></pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import { mapGetters } from "vuex";
import { dynamicsObject, valueof } from "@/interfaces";
import { Instrument } from "@/interfaces/dto/instrument";
import { COURSES_ENUM } from "@/utils/enums";
import Pagination from "../common/table/modules/Pagination.vue";

export default defineComponent({
  name: "InstrumentsName",
  data() {
    return {
      query: {
        limit: 15,
        page: 1,
        name: "",
        course: COURSES_ENUM.ONE as valueof<COURSES_ENUM>,
      },
      COURSES_ENUM: COURSES_ENUM,
      total: 0,
      instruments: [] as Array<Instrument.Dto>,
      variables: [] as Array<string>,
    };
  },
  created() {
    this.query.course = this.user?.course.type;
    this.$store.commit('setCourse', this.user?.course.type);
    this.getInstruments();
  },
  mounted() {
    this.emits();
  },
  unmounted() {
    this.unemits();
  },
  methods: {
    selectCourse(course: valueof<COURSES_ENUM>) {
      this.$store.commit('setCourse', course);
      this.query.course = course;
      this.getInstruments();
    },
    emits() {
      this.emitter.on(
        "commonInstrumentCreate",
        this.commonInstrumentCreateEmmiter
      );
      this.emitter.on("commonInstrumentEdit", this.commonInstrumentEditEmmiter);
      this.emitter.on(
        "commonInstrumentRemove",
        this.commonInstrumentRemoveEmmiter
      );
    },
    unemits() {
      this.emitter.off(
        "commonInstrumentCreate",
        this.commonInstrumentCreateEmmiter
      );
      this.emitter.off(
        "commonInstrumentEdit",
        this.commonInstrumentEditEmmiter
      );
      this.emitter.off(
        "commonInstrumentRemove",
        this.commonInstrumentRemoveEmmiter
      );
    },
    modal(id: string, data: dynamicsObject | null) {
      this.$store.commit("createModal", { id, data });
    },
    page(page: number) {
      this.query.page = page;
      this.search();
    },
    search() {
      this.getInstruments();
    },
    async getInstruments() {
      this.variables = [
        "title",
        "name",
        "price",
        `currency_${this.query.course}`,
        `base_currency_${this.query.course}`,
        `class_${this.query.course}`,
        `instrument_type_${this.query.course}`,
        `country_${this.query.course}`,
        `section_${this.query.course}`,
        `commentLength`,
      ];
      const result = await this.API.instrument.getInstrumentList({
        params: this.query,
      });
      this.instruments = result.data;
      this.total = result.total;
    },
    async onBlockedInstrument(instrument: Instrument.Dto) {
      await this.API.instrument.onBlockedInstrument(instrument);
    },
    commonInstrumentCreateEmmiter(data: Instrument.Dto) {
      this.instruments = [data, ...this.instruments];
    },
    commonInstrumentEditEmmiter(data: Instrument.Dto) {
      const instrument = this.instruments.find(
        (i) => String(i._id) === String(data._id)
      );
      if (instrument) {
        for (const key in data) {
          instrument[key] = data[key];
        }
      }
    },
    commonInstrumentRemoveEmmiter(data: string) {
      this.instruments = this.instruments.filter(
        (i) => String(i._id) !== String(data)
      );
    },
  },
  computed: {
    ...mapGetters(["user"]),
  },
  components: {
    Pagination,
  },
});
</script>

<style lang="scss" scoped>
.instruments {
  background: #ffffff;
  box-shadow: 2px 2px 10px rgba(0, 50, 92, 0.1);
  border-radius: 10px;
  padding: 10px 20px;
  margin: 30px 3%;
  &--title {
    padding-bottom: 20px;
    span {
      font-weight: 500;
      font-size: 18px;
      letter-spacing: 0.05em;
    }
    .actions {
      .courses {
        margin-right: 15px;
        .btn {
          border-radius: 0;
          color: #9CA0B0;
          background-color: #F4F5F9;
          &.btn--left {
            border-radius: 10px 0 0 10px;
          }
          &.btn--right {
            border-radius: 0 10px 10px 0;
          }
          &.selected {
            background-color: rgb(193, 196, 209);
            color: #fff;
          }
        }
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
  }
  &--container {
    table {
      width: 100%;
      table-layout: fixed;
      tr {
        th,
        td {
          text-align: left;
          font-size: 14px;
          padding: 10px 15px;
        }
      }
      thead {
        tr {
          th {
            font-weight: 500;
          }
        }
      }
      tbody {
        tr {
          td {
            font-weight: 300;
            .col {
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            &.actions {
              > div {
                display: flex;
                justify-content: space-around;
                > div {
                  cursor: pointer;
                }
              }
            }
            &.blocked,
            &.actions {
              text-align: center;
              vertical-align: middle;
            }
          }
          &:nth-child(2n - 1) {
            background-color: #F4F5F9;
          }
        }
      }
    }
  }
}
</style>
