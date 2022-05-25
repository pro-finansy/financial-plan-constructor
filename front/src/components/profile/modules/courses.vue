<template>
  <section class="commonProfile" v-if="user && user.role === 'EXPERT'">
    <div class="commonProfile--title">Курсы</div>
    <div class="commonProfile--container flex">
      <div class="courses">
        <label
          @click="changeCourse(course._id)"
          class="course flex items-center"
          v-for="course of courses"
          :key="course._id"
        >
          <input
            type="radio"
            name="course"
            :checked="course._id === user.course._id"
          />
          <span>{{ course.name }}</span>
        </label>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import { Course } from "@/interfaces/dto/course";

export default defineComponent({
  name: "ProfileCourses",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      courses: [] as Array<Course.Dto>,
    };
  },
  created() {
    this.getCourses();
  },
  methods: {
    async getCourses() {
      const result = await this.API.common.getCourses();
      this.courses = result.data;
    },
    async changeCourse(course: string) {
      const result = await this.API.common.changeCourse({ course });
      this.$store.commit("updateUser", result.data);
    },
  },
});
</script>

<style lang="scss" scoped>
.commonProfile {
  height: fit-content;
  flex-grow: 1;
  width: 25%;
  background: #ffffff;
  border-radius: 10px;
  padding: 25px;
  &--title {
    font-weight: 500;
    font-size: 24px;
  }
  &--container {
    margin-top: 20px;
    .courses {
      .course {
        cursor: pointer;
        margin-bottom: 10px;
        span {
          margin-left: 10px;
          color: #989dac;
        }
      }
    }
  }
}
</style>
