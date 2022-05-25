import { dynamicsObject, valueof } from "@/interfaces/index";
import { QUESTIONNAIRE_STATUSES_ENUM, QUESTIONNAIRE_VERSIONS_ENUM, ROLES_ENUM } from "@/utils/enums";
import { Instrument } from "../instrument";

export namespace Questionnaire {
  export interface QCommonModule {
    module: {
      data: dynamicsObject
    }
  }

  export interface QSectionModules {
    data: Instrument.Dto,
    inputs: Array<Instrument.Input>
  }

  export interface QCommonModules {
    data: Array<QCommonModule>
  }
  
  export interface QContentElement {
    id: string,
    data: QCommonModule
  }
  
  export interface QTargetStatuses {
    existing: number,
    student: number,
    expert: number
  }
  
  export interface QSection {
    name: string,
    modules: Array<QSectionModules>,
    optional?: boolean,
    selected?: boolean,
    adding?: boolean,
    default: string,
    files?: dynamicsObject[] | null
  }
  
  export interface QTargetCommonElement {
    id?: number,
    name?: string,
    sections: Array<QSection>
  }
  
  export interface QTargetPortfolio {
    id: string,
    name: string,
    description?: string,
    sections: Array<QSection>
  }

  export type Portfolios = 'expert' | 'student' | 'existing';

  export type QTargetPortfolios = {
    [portfolio in Portfolios]: QTargetPortfolio
  }

  export interface QTarget {
    id: number,
    name: string,
    status: QTargetStatuses,
    type: QTargetCommonElement,
    conclusion: QTargetCommonElement,
    portfolios: QTargetPortfolios,
    selected?: boolean,
    main: QSectionModules
  }

  export interface QTargets {
    id: string,
    data: Array<QTarget>
  }
  
  export interface Dto {
    student: QContentElement,
    targets: QTargets,
    insuranceProduct: QContentElement,
    comment: QContentElement
  }

  export interface Content {
    student: dynamicsObject,
    targets: Array<QTarget>,
    insuranceProduct: dynamicsObject,
    comment: dynamicsObject
  }

  export interface Server {
    _id: string,
    content_EXPERT: Content | null,
    content_STUDENT: Content | null,
    content_COMBINE_EXPERT: Content | null,
    content_COMBINE_STUDENT: Content | null,
    status: keyof typeof QUESTIONNAIRE_STATUSES_ENUM,
    version: valueof<typeof QUESTIONNAIRE_VERSIONS_ENUM>,
    streamDate: string,
    seconds: number,
    owner: keyof typeof ROLES_ENUM,
    studentEmail: string,
    files: Array<dynamicsObject> | null,
    course: dynamicsObject,
    student: dynamicsObject,
    expert: dynamicsObject,
    prevExpert: string | null,
    date: Date | number | null,
    sentedAt: Date | number | null,
    completedAt: Date | number | null,
    createdAt: Date | number | null,
    updatedAt: Date | number | null,
    markModified: Function,
    __v: number
  }
}