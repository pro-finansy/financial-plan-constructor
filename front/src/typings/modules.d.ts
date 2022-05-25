import { Vue } from "vue/types/vue";
import { ComponentCustomProperties } from 'vue';
import { Store } from 'vuex';
import { AxiosStatic } from 'axios';
import jquery from 'jquery';
import { Emitter } from 'mitt';
import { Socket } from 'socket.io-client';
import { dynamicsObject } from "@/interfaces";
import api from "@/api";

declare module '@vue/runtime-core' {
  interface State { }

  interface ComponentCustomProperties {
    $store: Store<State>,
    axios: AxiosStatic,
    emitter: Emitter,
    socket: Socket,
    jq: typeof jquery,
    API: dynamicsObject
  }
}