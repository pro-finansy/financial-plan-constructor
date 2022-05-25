<template>
  <section class="questionnaire flex direction-column items-center" :class="mode" v-if="!loading && !pending">
    <Header
      :qqstatus="qqstatus"
      :seconds="seconds"
      :targets="questionnaire.targets"
      :role="user.role"
      @onSeconds="onSeconds"
      @editQuestionnaire="editQuestionnaire"
      @stopQuestionnaire="stopQuestionnaire"
      @pauseQuestionnaire="pauseQuestionnaire"
      @saveQuestionnaireInterval="saveQuestionnaireInterval"
    />
    <Container
      @modeChange="modeChange"
      @addStudentTarget="addStudentTarget"
      @selectQuestionnaireSection="selectQuestionnaireSection" 
      @selectTarget="selectTarget"
      @finish="finish"
      @saveStudentQuestionnaire="saveStudentQuestionnaire"
      @combine="combine"
      @uncombine="uncombine"
      :mode="mode"
      :pending="pending" 
      :course="course" 
      :correctSection="correctSection" 
      :questionnaire="questionnaire" 
      :questionnaireStudent="questionnaireStudent" 
      :questionnaireMode="questionnaireMode"
      :role="user.role"
    />
    <NavigationBlock />
    <transition name="fade">
      <div v-if="saved" class="saved">Анкета сохранена...</div>
    </transition>
    <div class="infoModule" v-if="course === 'one'"></div>
  </section>
  <section class="loading flex items-center justify-center" v-else-if="loading">
    <div>Загрузка анкеты...</div>
  </section>
  <section class="loading flex items-center justify-center" v-else-if="pending">
    <div>Отправка анкеты...</div>
  </section>
</template>

<script lang="ts">
import { computed, defineAsyncComponent, defineComponent } from 'vue-demi';
import { mapGetters } from "vuex";
import { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { dynamicsObject, valueof } from '@/interfaces';
import { Questionnaire } from '@/interfaces/dto/questionnaire';
import { COURSES_ENUM, QUESTIONNAIRE_STATUSES_ENUM, ROLES_ENUM } from '../../utils/enums';
import collectionData from "./modules/collectionData";
import NavigationBlock from './modules/navigation/index.vue';
import { checkTwoCourse } from './qcheck/two';
import { checkFields, checkStudentFields, recalculationQuantity, checkStudentNullInstruments } from './qoptions';

const Header = defineAsyncComponent(() => import('./modules/header/index.vue'));
const Container = defineAsyncComponent(() => import('./modules/container/index.vue'));

export default defineComponent({
  name: "QuestionnaireMain",
  data() {
    return {
      seconds: 0,
      questionnaire_id: this.$.attrs._id as string,
      pending: false,
      loading: true,
      course: COURSES_ENUM.ONE as valueof<typeof COURSES_ENUM>,
      correctSection: 'target',
      mode: 'list',
      timeout: 0,
      interval: Date.now(),
      qqstatus: '',
      saved: false,
    };
  },
  computed: {
    ...mapGetters(["user", "questionnaire", "questionnaireStudent", "questionnaireStatus", "questionnaireMode"]),
  },
  created() {
    this.getQuestionnaire();
    this.getInvestments();
    this.$store.dispatch('getConvert');
  },
  provide() {
    return {
      role: computed(() => this.user.role),
      questionnaire_id: computed(() => this.questionnaire_id),
    }
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll);
    this.emits();
  },
  beforeUnmount() {
    clearInterval(this.timeout);
    this.timeout = 0;
  },
  unmounted() {
    this.jq('body').css('height', '100%');
    this.jq('body').unbind('click');

    this.emitter.off('verification', this.verificationEmitter);
    this.emitter.off('removeStudentTarget', this.removeStudentTargetEmitter);

    window.removeEventListener('scroll', this.onScroll);
    this.unsubscribeQuestionnaire();
  },
  methods: {
    subscribeQuestionnaire(questionnaire: Questionnaire.Server) {
      this.socket.emit('createRoom', { id: String(questionnaire._id), role: this.user.role });
      this.socket.on(`check`, ({ status }) => {
        if (status) {
          this.$router.push('/expert/notverified');
          this.$store.commit("createNotification", {
            status: "error",
            message: `Студент редактирует работу!`,
          });
        } else {
          this.fillQuestionnaire(questionnaire);
        }
      });
    },
    unsubscribeQuestionnaire() {
      this.socket.emit('leaveRoom', { id: String(this.questionnaire_id) });
      // this.sockets.unsubscribe(`check`);
    },
    emits() {
      this.emitter.on('verification', this.verificationEmitter);
      this.emitter.on('removeStudentTarget', this.removeStudentTargetEmitter);
    },
    verificationEmitter() {
      this.verification();
    },
    removeStudentTargetEmitter(id: number) {
      this.$store.commit('removeTarget', id - 1);
      this.questionnaire.targets[0].selected = true;
    },
    onScroll() {
      if (!this.jq('.target .portfolio').offset()) return;
      this.jq('.target').toArray().forEach(target => {
        this.jq(target).find('.portfolio').toArray().forEach(portfolio => {
          const top = this.jq(portfolio).offset()?.top || 0;
          const bottom = top + (this.jq(portfolio).height() || 0);
          if (top < window.scrollY && bottom > window.scrollY) {
            const targetId = this.jq(target).attr('data-id')?.split('-').pop();
            const name = (this.jq(portfolio).attr('data-id') as Questionnaire.Portfolios);
            const names = {
              'existing': 'Существующий портфель',
              'student': 'Портфель студента',
              'expert': 'Портфель эксперта',
            }
            this.jq('.infoModule').html(`${names[name]} ${this.course === COURSES_ENUM.ONE ? `(Цель ${targetId})` : ''}`);
          }
        });
        const tpTop = this.jq('.target .portfolio').offset() || { top: 0 };
        if (tpTop.top > window.scrollY) this.jq('.infoModule').html('');
      });
    },
    getQuestionnaire() {
      this.course = this.user.course?.type || COURSES_ENUM.ONE;
      this.$store.commit('clearQuestionnaire', { course: this.course, role: this.user.role });
      this.axios
        .get(`/api/questionnaire/id/${this.questionnaire_id}`)
        .then((res) => {
          this.$store.commit('clearQuestionnaire', { course: this.course, role: this.user.role, owner: res.data.owner });
          if (res.data.status === QUESTIONNAIRE_STATUSES_ENUM.NOTVERIFIED) {
            this.subscribeQuestionnaire(res.data);
          } else {
            this.fillQuestionnaire(res.data);
          }
        })
        .catch(err => {
          this.$store.commit("createNotification", {
            status: "error",
            message: err.response.status === 404 ? `Анкета не найдена!` : 'Что-то пошло не так!',
          });
          this.$router.push(this.user.role === ROLES_ENUM.STUDENT ? "/student/works" : "/process");
        })
    },
    async fillQuestionnaire(questionnaire: Questionnaire.Server) {
      this.seconds = questionnaire.seconds;
      this.course = questionnaire.course.type;
      this.qqstatus = questionnaire.status;
      await this.$store.commit('fillQuestionnaireData', { questionnaireData: questionnaire, course: this.course, role: this.user.role });
      this.disableInputs();
      this.jq('body').css('height', 'auto');
      this.loading = false;
    },
    disableInputs() {
      if (this.mode === 'list' && !this.questionnaireStatus) {
        setTimeout(() => {
          this.jq('input, textarea').prop('disabled', true);
          this.jq('.input img').css('pointer-events', 'none');
        }, 150);
      }
    },
    saveStudentQuestionnaire() {
      const data = { content_STUDENT: collectionData(this.questionnaireStudent) };
      this.API.questionnaire.saveStudentQuestionnaire(this.questionnaire_id, data);
    },
    async combine() {
      const data = {
        content_COMBINE_EXPERT: collectionData(this.questionnaire),
        content_COMBINE_STUDENT: collectionData(this.questionnaireStudent)
      }
      await this.API.questionnaire.onCombine(this.questionnaire_id, data);
      this.$store.commit('setUncombine');
    },
    async uncombine() {
      const result = await this.API.questionnaire.onUnCombine(this.questionnaire_id);
      await this.$store.commit('fillQuestionnaireData', { questionnaireData: result.data, course: this.course, role: this.user.role });
    },
    finish() {
      if (this.course === COURSES_ENUM.ONE && !checkFields(this)) return;
      if (this.course === COURSES_ENUM.TWO && !checkTwoCourse(this)) return;
      this.jq('body').css('height', '100%');
      this.questionnaireSave();
    },
    addStudentTarget() {
      this.mode = 'list';
      this.questionnaire.targets.forEach((t: dynamicsObject) => t.selected = false);
      this.questionnaire.targets[this.questionnaire.targets.length - 1].selected = true;
      setTimeout(() => {
        this.jq('html, body').animate({ scrollTop: (this.jq(`[data-id='target-${this.questionnaire.targets.length}']`).offset() || { top: 170 }).top - 170 }, 0);
      }, 100);
    },
    modeChange() {
      this.mode = this.mode === 'list' ? 'table' : 'list';
      if (this.mode === 'table') {
        recalculationQuantity(this.questionnaire, this.course);
      }
      this.disableInputs();
      this.jq('html, body').animate({ scrollTop: 0 }, 0);
    },
    async verification() {
      if (!checkStudentFields(this)) return;
      if (!checkStudentNullInstruments(this.questionnaire.targets[0].portfolios.student.sections)) {
        const element = this.jq(`[data-id="studentPortfolio"]`);
        const element_offset = Math.abs(
          element.offset()?.top || 100
        );
        this.jq("html, body").stop().animate({ scrollTop: element_offset - 100 }, 0);
        this.jq(".questionnaire").stop().animate({ scrollTop: element_offset - 100 }, 0);
        return this.$store.commit("createNotification", {
          status: "error",
          message: `У Вас есть "нулевой" инструмент в основном портфеле! Он подсвечен красным!`,
        });
      }
      
      // if (!this.checkFiles()) return;
      this.pending = true;
      this.jq('body').css('height', '100%');
      const data = {
        content_STUDENT: collectionData(this.questionnaire),
        seconds: this.seconds
      }
      // await this.API.questionnaire.onVerification(this.questionnaire_id, data);

      this.axios
        .put(`/api/questionnaire/${this.questionnaire_id}/verification`, data)
        .then(() => {
          this.$router.push('/student/works');
        })
        .catch(err => {
          this.pending = false;
          this.jq('body').css('height', 'auto');
          this.$store.commit("createNotification", {
            status: "error",
            message: err.response.data.message,
          });
        });
    },
    questionnaireSave() {
      this.pending = true;
      this.finishQuestionnaire();
    },
    finishQuestionnaire() {
      const data: dynamicsObject = {
        seconds: this.seconds
      };
      data['content_EXPERT'] = collectionData(this.questionnaire);
      
      const options = this.collectOptions(data, "patch", 'api/questionnaire/finish', this.questionnaire_id);
      this.questionnaireRequest(options, false, true);
    },
    selectQuestionnaireSection(id: string) {
      this.correctSection = id;
      this.disableInputs();
    },
    selectTarget(id: number) {
      this.questionnaire.targets.forEach((t: dynamicsObject) => t.selected = false);
      this.questionnaire.targets.find((t: dynamicsObject) => t.id === id).selected = true;
      this.disableInputs();
    },
    checkFiles() {
      if (this.course === COURSES_ENUM.ONE) return true;
      for (const target of this.questionnaire.targets) {
        for (const key in target.portfolios) {
          if (key === 'expert') return true;
          const portfolio = target.portfolios[key];
          if (portfolio.sections[2].files.length === 0 && portfolio.sections[2].modules.filter((m: Questionnaire.QSectionModules) => m.data.name && m.data.price).length > 0) {
            this.$store.commit("createNotification", {
              status: "error",
              message: `Прикрепите скриншот таблицы для тактической идеи в пункте "${portfolio.name}"`,
            });
            return false;
          }
        }
      }
      return true;
    },
    onSeconds() {
      this.seconds++;
    },
    saveQuestionnaireInterval() {
      this.timeout = setInterval(() => {
        this.editQuestionnaire(false);
      }, 6000);
    },
    pauseQuestionnaire() {
      if (this.user.role === ROLES_ENUM.STUDENT) {
        return this.stopQuestionnaire();
      }
      this.$store.commit('onQuestionnaireStatus', false);
      this.disableInputs();
      clearInterval(this.timeout);
    },
    stopQuestionnaire(redirect = true) {
      const data: dynamicsObject = {
        seconds: this.seconds
      };
      data['content_' + this.user.role] = collectionData(this.questionnaire);
      
      const options = this.collectOptions(data, "put", 'api/questionnaire/stop', this.questionnaire_id);
      this.questionnaireRequest(options, redirect);
    },
    editQuestionnaire(redirect = true) {
      const data: dynamicsObject = {
        seconds: this.seconds
      };
      data['content_' + this.user.role] = collectionData(this.questionnaire);
      
      const options = this.collectOptions(data, "put", 'api/questionnaire', this.questionnaire_id);
      this.questionnaireRequest(options, redirect);
    },
    collectOptions(data: dynamicsObject, method: Method, url: string, _id = "") {
      return {
        method: method,
        url: `/${url}/${_id}`,
        data,
      };
    },
    questionnaireRequest(options: AxiosRequestConfig, redirect: boolean, finish = false) {
      this.axios(options)
        .then((res: AxiosResponse) => {
          if (localStorage.getItem('saveMode')) localStorage.removeItem('saveMode');
          this.questionnaire_id = res.data._id;
          if (options.method === "put" && redirect) {
            this.$router.push(this.user.role === ROLES_ENUM.STUDENT ? "/student/works" : "/expert/notverified");
          };
          if (finish) {
            this.$router.push({ path: '/preview/' + this.questionnaire_id, query: { collection: 'true' } });
          }
          if (!redirect) {
            this.saved = true;
            setTimeout(() => {
              this.saved = false;
            }, 3000);
          }
        })
        .catch((err: any) => {
          this.pending = false;
          if (err?.response?.status === 400 || err?.response?.status === 404) {
            clearInterval(this.timeout);
            return this.$router.push('/auth');
          }
          this.$store.commit("createQuestionnaireError", {
            err: err,
            questionnaire: this.questionnaire_id,
            status: 'error'
          });
          this.jq('body').css('height', 'auto');
        });
    },
    async getInvestments() {
      const result = await this.API.instrument.getInstruments();
      this.$store.commit('setInstruments', result.data);
    }
  },
  components: {
    Header,
    Container,
    NavigationBlock
  },
});
</script>

<style lang="scss" scoped>
.loading {
  width: 100%;
  height: 100%;
  font-size: 28px;
  font-weight: 300;
  div {
    color: gray;
  }
}
.questionnaire {
  background: #fff;
  overflow: auto;
  &.table {
    background-color: transparent;
  }
  .infoModule {
    position: fixed;
    top: 75px;
    left: 60px;
    z-index: 2;
    font-size: 14px;
    font-weight: 300;
  }
  .saved {
    position: fixed;
    top: 5px;
    right: 45px;
    z-index: 10;
    font-size: 14px;
  }
}
</style>
