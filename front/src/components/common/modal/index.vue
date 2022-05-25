<template>
  <section class="modalover">
    <div class="overflow"></div>
    <div class="modal flex justify-between direction-column" :class="{info: isInfoModal}">
      <ModalHeader :data="data" />
      <ModalContainerInfo v-if="isInfoModal" @change-pending="changePending" :data="data" />
      <ModalContainer
        v-else
        :data="data" 
        :datas="datas" 
        :targetTotal="targetTotal"
        :targetCurrencyId="targetCurrencyId"
        :targetId="targetId"
      />
      <ModalActions
        @removeModal="removeModal"
        @submit="submit"
        :data="data"
        :pending="!isRequest ? pending : pendingRequest"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import { mapGetters } from "vuex";
import 'jqueryui';
import getCurrentContent from "./datas/getCurrentContent";
import getCurrentInputs from "./datas/getCurrentInputs";
import getRequests from "./datas/getRequests";
import ModalHeader from "./modules/ModalHeader.vue";
import ModalContainer from "./modules/ModalContainer.vue";
import ModalContainerInfo from "./modules/ModalContainerInfo.vue";
import ModalActions from "./modules/ModalActions.vue";
import { getCurrencyTwo } from '../../questionnaire/modules/container/table/modules/container/calculation';
import { dynamicsObject } from "@/interfaces";
import { FIXING_PERCENT, ERROR_ADDED_INSTRUMENT, NOT_SELECTED_TARGET_CURRENCY, CORE_TACTIC_ERROR, NOT_SELECTED_TARGET_FV, INSTRUMENT_TYPES, INSTRUMENT_SECTIONS } from "./constants";
import { HELP_LIST } from "@/store/commonDatas";
import { AxiosRequestConfig } from "axios";
import { Instrument } from "@/interfaces/dto/instrument";
import { ROLES_ENUM } from "@/utils/enums";

export default defineComponent({
  name: "Modal",
  props: {
    modal: {
      type: Object,
      required: true,
    }
  },
  emits: ['showModal'],
  data() {
    return {
      options: {} as dynamicsObject,
      data: {} as dynamicsObject,
      datas: {
        accesses: [],
        experts: [],
        codes: [],
      },
      pending: false,
      isRequest: true,
      targetTotal: '',
      targetCurrencyId: '',
      totalInstruments: [] as dynamicsObject,
      targetId: 1
    };
  },
  mounted() {
    if ((this.options.id === "questionnaire_instrument-edit" || this.options.id === "questionnaire_instrument-create") && this.user.role === ROLES_ENUM.EXPERT) {
      this.jq('.modal').draggable();
      this.jq('.modal').addClass('draggable');
      this.jq('.modal').css('top', `calc(50% - ${(Number(this.jq('.modal').height()) + 50) / 2}px)`)
    } else {
      if ((this.jq('.modal').outerHeight(true) || 0) < 565) {
        this.jq('.modal main').addClass('overflowMain');
      }
      if (window.innerHeight < 655) {
        this.jq('.modal main').removeClass('overflowMain');
      }
    }
    document.addEventListener('keydown', this.keys);
  },
  unmounted() {
    document.removeEventListener('keydown', this.keys);
  },
  methods: {
    keys(ev: any) {
      if (ev.key === 'Escape') this.removeModal();
      if (ev.key === 'Enter' && !ev.shiftKey) this.submit();
    },
    checkInputs() {
      for (const key in this.data.inputs.data) {
        const input: Instrument.Input = this.data.inputs.inputs.find((i: dynamicsObject) => i.id === key);
        if (!input) continue;
        if (input.drop && !this.data.inputs.data[key + '_id'] && input.required && !input.uncheck) {
          input.error = true;
          return { status: false, input, showMessage: true };
        }
        // if (input.drop && this.data.inputs.data[key + '_id'] && input.required && !input.uncheck) {
        //   const current_drop = input.drop_data.find(e => e._id === this.data.inputs.data[key + '_id']);
        //   console.log(input.drop_data);
        //   console.log(this.data.inputs.data[key + '_id']);
        //   console.log(key, current_drop);
        //   if (current_drop) {
        //     this.data.inputs.data[key] = current_drop.name;
        //   }
        // }
        let value = this.data.inputs.data[key];
        if (input.type === 'number') value = Number(value);
        if (!value && input.required) {
          input.error = true;
          return { status: false, input };
        } else {
          input.error = false;
        }
      }
      return { status: true };
    },
    removeModal() {
      this.$emit('showModal', false);
    },
    getTotalRuleInstruments(rule: string) {
      if (rule === 'Тактика') return this.totalInstruments.filter((i: dynamicsObject) => !i.core).length;
      if (rule === 'Защита') return this.totalInstruments.filter((i: dynamicsObject) => i.core && i[`class_${this.course}_id`] === 'alternative').length;
      else return this.totalInstruments.filter((i: dynamicsObject) => i.core && i[`instrument_type_${this.course}`] === rule).length; 
    },
    checkMaxInstruments() {
      if (this.data.inputs.data.portfolioId === "expertPortfolio" || this.user.role === ROLES_ENUM.EXPERT) return { status: true, error: null };
      const instrument = this.data.inputs.data;
      
      const rule = !instrument.type ? 'Тактика' : instrument[`class_${this.course}_id`] === 'alternative' ? 'Защита' : instrument[`instrument_type_${this.course}`];
      const rules = HELP_LIST.find(course => course.id === this.course)?.max;
      const currentRule = rules?.find(r => r.rules === rule);
      if (!currentRule) return { status: true, error: null };
      
      const total = this.getTotalRuleInstruments(currentRule.rules);
      const c_instrument = this.totalInstruments.find((i: Instrument.Input) => i.name === instrument.name);
      const prev = !c_instrument ? false : c_instrument[`class_${this.course}_id`] === 'alternative' ? 'Защита' : c_instrument[`instrument_type_${this.course}`] && rule !== 'Тактика' ? c_instrument[`instrument_type_${this.course}`] : 'Тактика';
      
      let plus = c_instrument ? 0 : 1;
      if (prev && prev !== rule) {
        plus += 1;
      }
      
      if (currentRule.value < total + plus) {
        return { status: false, error: currentRule.error };
      }
      return { status: true, error: null };
    },
    checkFillPortfolio() {
      if (this.data.inputs.data.portfolioId === "existingPortfolio") return true;
      const instrument = this.data.inputs.data;
      const maxInstruments = this.checkMaxInstruments();
      if (!maxInstruments.status) {
        this.$store.commit("createNotification", {
          status: "error",
          message: `В Вашем портфеле достигнуто максимальное количество ${maxInstruments.error}!`,
        });
        return false;
      }
      let totalPercent = 0;
      let temp = 0;
      let c_instrument = this.totalInstruments.find((i: dynamicsObject) => i.name === instrument.name);
      if (!instrument.number_papers) return false;
      if (this.data.content.action === 'edit') {
        if (c_instrument) {
          temp = c_instrument.percent;
          c_instrument.percent = instrument.percent;
        }
      } else {
        totalPercent += Number(instrument.percent);
      }
      let instrumentPercents = this.totalInstruments.reduce((acc: number, m: dynamicsObject) => acc + Number(m.percent), 0);
      totalPercent += Number(instrumentPercents);
      if (Number(totalPercent.toFixed(0)) > 100) {
        let percents = '0';
        if (this.data.content.action === 'edit' && c_instrument) {
          const difference = instrumentPercents - 100;
          percents = (instrument.percent - difference).toFixed(2);
          this.data.inputs.data.percent = (instrument.percent - difference).toFixed(2);
          const number_papers = Math.floor((Number(this.targetTotal) * (instrument.percent / 100)) / getCurrencyTwo(instrument, this.targetCurrencyId, this.course));
          instrument.number_papers = number_papers;
        } else if (100 - instrumentPercents > 0) {
          percents = (100 - instrumentPercents).toFixed(2);
          this.data.inputs.data.percent = (100 - instrumentPercents).toFixed(2);
          const number_papers = Math.floor((Number(this.targetTotal) * (instrument.percent / 100)) / getCurrencyTwo(instrument, this.targetCurrencyId, this.course));
          instrument.number_papers = number_papers;
        }
        this.$store.commit("createNotification", {
          status: "error",
          message: ERROR_ADDED_INSTRUMENT(percents),
          timeout: 10000
        });
        this.$store.commit('togglePendingRequest', false);
        return false;
      } else if (this.user.role === ROLES_ENUM.STUDENT || (this.user.role === ROLES_ENUM.EXPERT && this.data.inputs.data.portfolioId === 'expertPortfolio')) {
        const total = getCurrencyTwo(instrument, this.targetCurrencyId, this.course) * instrument.number_papers;
        const percent = Math.ceil10((total / Number(this.targetTotal)) * 100, -2);
        if (percent !== instrument.percent) {
          instrument.percent = percent;
          this.$store.commit("createNotification", { status: "info", message: FIXING_PERCENT});
        }
      }
      return true;
    },
    checkAddedInstrument(inputs: dynamicsObject) {
      if (inputs.id.includes('questionnaire_instrument-') && inputs.inputs.length > 0) {
        if (!inputs.data.number_papers) {
          if (!this.targetCurrencyId) {
            this.$store.commit("createNotification", { status: "error", message: NOT_SELECTED_TARGET_CURRENCY });
            return false;
          }
          if (!this.targetTotal) {
            const message = this.data.inputs.data.portfolioId === 'expertPortfolio' ? CORE_TACTIC_ERROR : NOT_SELECTED_TARGET_FV;
            this.$store.commit("createNotification", { status: "error", message });
            return false;
          }
        }
      }
      return true;
    },
    async formDataRequest() {
      const formData = new FormData();
      for (const key in this.data.inputs.data) {
        formData.append(key, this.data.inputs.data[key]);
      }
      const result = await this.API.modal.formDataRequest(this.data.content.request, formData, { "Content-Type": "multipart/form-data" });
      this.emitter.emit(this.data.content.emit, result.data);
      this.removeModal();
    },
    async submit() {
      this.$store.commit('togglePendingRequest', true);
      if (!this.checkAddedInstrument(this.data.inputs)) {
        this.pending = false;
        return this.$store.commit('togglePendingRequest', false);
      }
      const resultCheck = this.checkInputs();
      if (!resultCheck.status && resultCheck.showMessage) {
        this.$store.commit("createNotification", {
          status: "error",
          message: `Вам необходимо выбрать вариант из списка в поле "${resultCheck.input.name}"!`,
        });
      }
      if (!resultCheck.status) {
        this.pending = false;
        return this.$store.commit('togglePendingRequest', false);
      }
      if (!this.data.content.method) {
        if (this.totalInstruments.length > 0 && !this.checkFillPortfolio()) return;
        this.removeModal();
        this.pending = false;
        return this.emitter.emit(this.data.content.emit, this.data.inputs.data);
      }
      if (this.data.content.formdata) return this.formDataRequest();
      const options = this.collectOptions();
      const result = await this.API.modal.onSubmit(options);

      if (this.data.inputs.data.upload) this.uploadFile(result.data._id);
      this.emitter.emit(this.data.content.emit, result.data);
      this.removeModal();
    },
    async uploadFile(_id: string) {
      const formData = new FormData();
      formData.append("avatar", this.data.inputs.data.upload);
      formData.append("_id", _id);

      const result = await this.API.modal.onUploadFile(this.data.content.upload_request, formData, { "Content-Type": "multipart/form-data" }, { _id });
      this.emitter.emit("upload", { _id, src: result.data });
    },
    collectOptions() {
      const options: AxiosRequestConfig = {
        method: this.data.content.method,
        url: `${this.data.content.request}${
          this.data.content.method === "delete"
            ? `/${this.data.inputs.data._id}`
            : ""
        }`,
      };
      if (this.data.content.method !== "delete") {
        options.data = this.data.inputs.data;
      }
      if (this.data.content.method === 'delete' && this.data.content.action === 'edit') {
        options.data = this.data.inputs.data;
      }
      if (this.data.content.method === "delete") {
        options.params = this.data.inputs.data;
      }      
      return options;
    },
    changePending(status: boolean) {
      this.pending = status;
    }
  },
  computed: {
    ...mapGetters(['course', 'pendingRequest', 'user']),
    isInfoModal() {
      return this.data.content.action === 'info';
    }
  },
  created() {
    this.options = this.modal;
    this.data = {
      content: getCurrentContent(this.options),
      inputs: getCurrentInputs(this.options),
    };
    getRequests(
      this.data,
      this.options,
      this.datas,
      this.API,
    );
    
    if (this.data.content.id === 'questionnaire-create-info') {
      this.pending = true;
    }
    
    if (!this.data.content.request) this.isRequest = false;
    if (this.options.data.targetCurrencyId) this.targetCurrencyId = this.options.data.targetCurrencyId;
    if (this.options.data.targetId) this.targetId = this.options.data.targetId;
    if (this.options.data.totalInstruments) this.totalInstruments = this.options.data.totalInstruments;
    if (this.options.data.targetTotal) this.targetTotal = this.options.data.targetTotal;
    if (this.data.content.id === "questionnaire_instrument-edit") {
      const type = this.data.inputs.data[`instrument_type_${this.course}`]
      const type_id = this.data.inputs.data[`instrument_type_${this.course}_id`];
      const section = this.data.inputs.data[`section_${this.course}`];
      const section_id = this.data.inputs.data[`section_${this.course}_id`];
      if (type && !type_id) {
        const current = INSTRUMENT_TYPES.find(i => i.name === type);
        if (current) this.data.inputs.data[`instrument_type_${this.course}_id`] = current._id;
      }
      if (section && !section_id) {
        const current = INSTRUMENT_SECTIONS.find(i => i.name === section);
        if (current) this.data.inputs.data[`section_${this.course}_id`] = current._id;
      }
    }
    this.$emit('showModal', true);
  },
  components: {
    ModalHeader,
    ModalContainer,
    ModalActions,
    ModalContainerInfo
  },
});
</script>

<style lang="scss" scoped>
.modalover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  .overflow {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 11;
    background-color: #3f3f3f85;
  }
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    z-index: 12;
    width: 550px;
    min-height: 16%;
    max-height: 90%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 25px 0;
    background-color: #fff;
    box-shadow: 0px 0px 17.1607px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    &.info {
      width: 650px;
    }    
    &.draggable {
      position: absolute;
      transform: none;
      left: calc(50% - 300px);
      margin-right: 0;
    }
  }
}
</style>