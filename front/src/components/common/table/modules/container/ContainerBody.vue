<template>
  <tbody>
    <tr v-for="row of data" :key="row._id">
      <table-element 
        v-for="col of options.variables" 
        :key="col" 
        :_id="row._id"
        :variable="col"
        :table="options.id"
        :element="row"
        :role="user?.role"
        :accesses="user?.accesses"
        v-html="transformData(row[col], col, row, options.id)"
      ></table-element>
      <td class="actions flex justify-end">
        <!-- <div v-if="options.id === 'questionnaire_student' && row.status === 'SENDED'">
          <svg @click="downloadFile(row._id)" width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.60149 15.9379C7.99201 16.3284 8.62518 16.3284 9.0157 15.9379L15.3797 9.57391C15.7702 9.18339 15.7702 8.55023 15.3797 8.1597C14.9891 7.76918 14.356 7.76918 13.9654 8.1597L8.30859 13.8166L2.65174 8.1597C2.26121 7.76918 1.62805 7.76918 1.23753 8.1597C0.847001 8.55022 0.847001 9.18339 1.23753 9.57391L7.60149 15.9379ZM7.30859 -4.37114e-08L7.30859 15.2308L9.30859 15.2308L9.30859 4.37114e-08L7.30859 -4.37114e-08Z" fill="#858995"/>
            <path d="M0 18H16.6154" stroke="#858995" stroke-width="2"/>
          </svg>
        </div> -->
        <div v-if="options.id.includes('questionnaire') && options.id !== 'questionnaire_notverified'" class="edit" @click="$router.push(`/questionnaire/${row._id}`)">
          <img v-if="options.id === 'questionnaire_student' && (row.status === 'PROCESS' || row.status === 'VERIFIED' || row.status === 'SENDED')" src="/images/common/table/eye.svg" alt="" />
          <img v-else src="/images/common/table/edit.svg" alt="" />
        </div>
        <div v-if="options.id === 'questionnaire_notverified'" class="edit" @click="$router.push(`/questionnaire/${row._id}`)">
          <div class="editAction flex items-center justify-center">
            <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.0742 5.55135C11.8476 5.99784 11.8476 7.11405 11.0742 7.56053L1.93922 12.8346C1.16588 13.2811 0.199219 12.723 0.199219 11.83L0.199219 1.28185C0.199219 0.388879 1.16589 -0.169226 1.93922 0.277258L11.0742 5.55135Z" fill="white"/>
            </svg>
          </div>
        </div>
        <div v-if="options.id === 'students' && roles" class="edit" @click="modal(`${options.id}-password`, row)">
          <img src="/images/common/table/edit.svg" alt="" />
        </div>
        <div v-if="options.actions.find((a: string) => a === 'edit')" class="edit" @click="modal(`${options.id}-edit`, row)">
          <img src="/images/common/table/edit.svg" alt="" />
        </div>
        <div v-if="options.id === 'students' && roles && row.fileStudent" class="file" @click="modal(`students-file`, row)">
          <img src="/images/common/table/dfile.svg" alt="" />
        </div>
        <div v-if="deleteAction(row)" class="remove" @click="modal(`${options.id}-remove`, row)">
          <img src="/images/common/table/remove.svg" alt="" />
        </div>
      </td>
    </tr>
  </tbody>
</template>

<script lang="ts">
import transformData from "@/utils/transformData";
import tableElement from './element.vue';

import { defineComponent, PropType } from "vue-demi";
import { mapGetters } from 'vuex';
import { QUESTIONNAIRE_STATUSES_ENUM, ROLES_ENUM } from '@/utils/enums';
import { dynamicsObject } from "@/interfaces";

export default defineComponent({
  name: "ContainerBody",
  props: {
    options: {
      type: Object,
      required: true,
    },
    data: {
      type: Array as PropType<Array<dynamicsObject>>,
      required: true,
    },
  },
  mounted() {
    this.followCheckbox();
  },
  computed: {
    ...mapGetters(['user']),
    roles() {
      return this.user && (this.user.role === ROLES_ENUM.SUPPORT || this.user.role === ROLES_ENUM.OWNER);
    }
  },
  components: {
    tableElement
  },
  methods: {
    transformData,
    modal(id: string, data = {}) {
      this.$store.commit("createModal", { id, data });
    },
    deleteAction(row: dynamicsObject) {
      return this.options.actions.find((a: string) => a === 'remove') && 
        (this.options.id !== 'questionnaire_student' || 
          (this.options.id === 'questionnaire_student' && (row.status === QUESTIONNAIRE_STATUSES_ENUM.NOTSENT || row.status === QUESTIONNAIRE_STATUSES_ENUM.NOTVERIFIED))
        ) &&
        (this.options.id !== 'students' || (this.options.id === 'students' && this.user && (this.user.role === ROLES_ENUM.OWNER || this.user.role === ROLES_ENUM.SUPPORT)));
    },
    followCheckbox() {
      const jquery = this.jq;
      const toggleExpertActive = this.toggleExpertActive;
      this.jq(".col input[type=\"checkbox\"]").change(function () {
        const active = jquery(this).prop("checked");
        const id = jquery(this).prop("id");
        toggleExpertActive(id, active);
      });
    },
    // async downloadFile(_id: string) {
    //   const result = await this.API.table.downloadQuestionnaireFile(`/api/questionnaire/file/${_id}`);
    //   const a = document.createElement('a');
    //   a.href = result.data.src;
    //   a.download = result.data.name;
    //   a.click();
    // },
    toggleExpertActive(id: string, active: boolean) {
      this.API.table.toggleExpertActive(`/api/user/active/${id}`, { active });
    },
  },
});
</script>

<style lang="scss" scoped>
tbody {
  tr {
    td {
      vertical-align: middle;
      border-top: 1px solid #f5f5f5;
      padding: 20px 10px 20px 0;
      :deep() .col {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        line-height: 16px;
        letter-spacing: 0.03em;
        span.error, span.danger {
          font-weight: 500;
          color: #ff6262;
        }
        .uploadFile {
          span {
            cursor: pointer;
            color: #348cff;
          }
        }
        > img {
          border-radius: 10px;
          width: 55px;
          height: 55px;
          object-fit: cover;
        }
        a, span.link {
          color: rgb(52, 140, 255);
          cursor: pointer;
        }

        input[type="checkbox"] {
          display: none;
        }
        input[type="checkbox"] + label {
          cursor: pointer;
          padding-left: 50px;
          position: relative;
          font-family: tahoma, sans-serif, arial;
          line-height: 40px;
        }
        input[type="checkbox"] + label::before {
          content: "";
          display: inline-block;
          position: absolute;
          top: 0;
          left: 0;
          vertical-align: middle;
          padding: 0;
          height: 24px;
          width: 60px;
          margin: 0 5px 0 0;
          background: linear-gradient(
              317.7deg,
              rgba(0, 0, 0, 0.4) 0%,
              rgba(255, 255, 255, 0.4) 105.18%
            ),
            #f4f5f9;
          background-blend-mode: soft-light, normal;
          border: 1px solid #ffffff;
          box-shadow: inset -5.18152px -5.18152px 10.363px #fafbff,
            inset 5.18152px 5.18152px 10.363px rgba(166, 171, 189, 0.2);
          border-radius: 40px;
        }
        input[type="checkbox"] + label::after {
          content: "";
          display: block;
          position: absolute;
          top: 3px;
          left: 4px;
          width: 20px;
          height: 20px;
          border-radius: 22px;
          background: #9da8ae;
          box-shadow: 0 3px 3px rgba(140, 140, 140, 0.1);
        }
        input[type="checkbox"]:checked + label::after {
          background: #349c5d;
        }
        input[type="checkbox"] + label::before,
        input[type="checkbox"] + label::after {
          -webkit-transition: all 0.2s ease-out;
          transition: all 0.2s ease-out;
        }
        input[type="checkbox"]:checked + label::after {
          left: 38px;
        }
      }
      &.actions {
        position: relative;
        top: -1px;
        div {
          padding: 5px 5px 5px 15px;
          cursor: pointer;
        }
        .editAction {
          background: linear-gradient(0deg, #349C5D, #349C5D);
          border-radius: 8px;
          padding: 10px 20px;
        }
        .edit, .file {
          img {
            width: 19px;
            height: 19px;
          }
        }
      }
    }
  }
}
</style>