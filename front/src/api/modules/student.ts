import axios from "axios";

export default {
  getCourseElement: async (_id: string) => {
    return await axios.get(`/api/student/course/${_id}`);
  },
};
