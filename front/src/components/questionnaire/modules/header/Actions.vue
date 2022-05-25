<template>
  <div class="actions flex" v-if="isPaused || !isStarted">
    <div
      class="play active questionnaire--element"
      @mouseenter="onShowHelp('play')"
      @mouseleave="showHelp = false"
      @click="
        $emit('play');
        showHelp = false;
      "
    >
      <svg
        width="20"
        height="23"
        viewBox="0 0 20 23"
        fill="#FFFFFF"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.75 9.3642C20.0833 10.134 20.0833 12.0585 18.75 12.8283L3 21.9216C1.66667 22.6914 -6.72981e-08 21.7291 0 20.1895L7.94959e-07 2.00298C8.62257e-07 0.463382 1.66667 -0.498867 3 0.270933L18.75 9.3642Z"
        />
      </svg>
    </div>
    <div class="pause questionnaire--element">
      <svg
        width="14"
        height="23"
        viewBox="0 0 14 23"
        fill="#ffffff50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="5" height="23" rx="2.5" />
        <rect x="9" width="5" height="23" rx="2.5" />
      </svg>
    </div>
    <div
      v-if="!isStarted && role !== 'STUDENT'"
      class="stop questionnaire--element"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#ffffff50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="24" height="24" rx="5" />
      </svg>
    </div>
    <div
      v-else-if="role !== 'STUDENT'"
      class="stop active questionnaire--element"
      @click="$emit('stop')"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#ffffff"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="24" height="24" rx="5" />
      </svg>
    </div>
  </div>
  <div class="actions flex" v-else>
    <div class="play questionnaire--element">
      <svg
        width="20"
        height="23"
        viewBox="0 0 20 23"
        fill="#ffffff50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.75 9.3642C20.0833 10.134 20.0833 12.0585 18.75 12.8283L3 21.9216C1.66667 22.6914 -6.72981e-08 21.7291 0 20.1895L7.94959e-07 2.00298C8.62257e-07 0.463382 1.66667 -0.498867 3 0.270933L18.75 9.3642Z"
        />
      </svg>
    </div>
    <div
      class="pause active questionnaire--element"
      @mouseenter="onShowHelp('pause')"
      @mouseleave="showHelp = false"
      @click="
        $emit('pause');
        showHelp = false;
      "
    >
      <svg
        width="14"
        height="23"
        viewBox="0 0 14 23"
        fill="#ffffff"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="5" height="23" rx="2.5" />
        <rect x="9" width="5" height="23" rx="2.5" />
      </svg>
    </div>
    <div
      v-if="role !== 'STUDENT'"
      class="stop active questionnaire--element"
      @mouseenter="onShowHelp('stop')"
      @mouseleave="showHelp = false"
      @click="
        $emit('stop');
        showHelp = false;
      "
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#ffffff"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="24" height="24" rx="5" />
      </svg>
    </div>
  </div>
  <transition name="fade">
    <div class="help" v-if="showHelp">{{ actions[currentAction] }}</div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";

enum Actions {
  play = "play",
  pause = "pause",
  stop = "stop",
}

export default defineComponent({
  name: "QuestionnaireActions",
  props: {
    isPaused: Boolean,
    isStarted: Boolean,
    role: String,
  },
  emits: ["play", "stop", "pause"],
  data() {
    return {
      actions: {
        play: "Начать работу",
        pause: "Приостановить работу",
        stop: "Приостановить работу и выйти",
      },
      showHelp: false,
      currentAction: "" as keyof typeof Actions,
    };
  },
  methods: {
    onShowHelp(action: keyof typeof Actions) {
      this.currentAction = action;
      this.showHelp = true;
    },
  },
});
</script>

<style lang="scss" scoped>
.questionnaire--element {
  width: 90px;
}
.help {
  position: absolute;
  top: 75px;
  font-size: 14px;
  color: #5c6272;
}
.actions {
  .play {
    background: linear-gradient(0deg, #349c5d, #349c5d);
  }
  .pause {
    background: linear-gradient(0deg, #fdcd00, #fdcd00);
  }
  .stop {
    background: linear-gradient(0deg, #fe7815, #fe7815);
  }
  div {
    height: 50px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      width: 20px;
      height: 20px;
    }
    &:not(:last-child) {
      margin-right: 15px;
    }
  }
  .active {
    cursor: pointer;
  }
}
</style>
