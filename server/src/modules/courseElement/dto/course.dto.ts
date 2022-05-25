import { dynamicsObject } from "@/interfaces";
import { Course } from "@/modules/course/dto/course.dto";
import { Questionnaire } from "@/modules/questionnaire/dto/questionnaire.dto";
import { User } from "@/modules/user/dto/user.dto";

export namespace CourseElement {
  export interface Dto {
    questionnaire: Questionnaire.Dto,
    course: Course.Dto,
    streamDate: string,
    chat: number,
    comment: string,
    studentEmail: string,
    expert: User.Dto,
    student: User.Dto,
    fileStudent: dynamicsObject,
    fileExpert: dynamicsObject
  } 
}