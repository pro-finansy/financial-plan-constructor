import { ACCESSES_ENUM, COURSE_ELEMENT_STATUSES_ENUM, QUESTIONNAIRE_STATUSES_ENUM } from "@/utils/enums";

export namespace CommonDatas {
  export interface Accesses {
    _id: keyof typeof ACCESSES_ENUM,
    name: string,
    selected?: boolean
  }
  export interface QuestionnaireStatuses {
    _id: keyof typeof QUESTIONNAIRE_STATUSES_ENUM,
    name: string
  }
  export interface CourseElementStatuses {
    _id: keyof typeof COURSE_ELEMENT_STATUSES_ENUM,
    name: string
  }
}