import { ObjectId } from "mongoose";
import { dynamicsObject, valueof } from "@/interfaces/index";
import { QUESTIONNAIRE_STATUSES, QUESTIONNAIRE_VERSIONS, ROLES } from '@/utils/enums';

export namespace Questionnaire {
  export interface QCommonModule {
    module: {
      data: dynamicsObject
    }
  }

  export interface QSectionModules {
    data: dynamicsObject
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
    modules: Array<QSectionModules>,
    optional?: boolean,
    selected?: boolean,
    default: string
  }
  
  export interface QTargetCommonElement {
    id?: number,
    name?: string,
    sections: Array<QSection>
  }
  
  export interface QTargetPortfolio {
    sections: Array<QSection>
  }

  type Portfolios = 'expert' | 'student' | 'existing';

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
    main: {
      data: dynamicsObject
    }
  }
  
  export interface QContentTargets {
    id: string,
    data: Array<QTarget>
  }
  
  export interface QContent {
    student: QContentElement,
    targets: QContentTargets,
    insuranceProduct: QContentElement,
    comment: QContentElement
  }
  
  export interface Dto {
    _id: ObjectId,
    content_EXPERT: QContent | null,
    content_STUDENT: QContent | null,
    content_COMBINE_EXPERT: QContent | null,
    content_COMBINE_STUDENT: QContent | null,
    status: keyof typeof QUESTIONNAIRE_STATUSES,
    version: valueof<typeof QUESTIONNAIRE_VERSIONS>,
    streamDate: string,
    seconds: number,
    owner: keyof typeof ROLES,
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