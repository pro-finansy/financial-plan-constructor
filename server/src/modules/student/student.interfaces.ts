export interface StudentListQuery {
  expert?: string,
  course?: string,
  status?: string,
  streamDate?: string,
  student?: object,
  fileStudent?: object,
  fileExpert?: object,
  [key: string]: any
}