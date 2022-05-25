import { Commit } from 'vuex';
import axios from 'axios';
import router from '@/router/index';
import roleRoutes from "@/utils/roleRoutes";
import { User } from '@/interfaces/dto/user';
import { dynamicsObject } from '@/interfaces';

interface State {
  Authorization: string | null,
  user: User.Dto | null
}

export default {
  state: {
    Authorization: null,
    user: null,
  },
  getters: {
    Authorization: (state: State) => state.Authorization,
    user: (state: State) => state.user,
  },
  mutations: {
    authorization(state: State, user: User.Dto) {
      state.Authorization = user.token;
      state.user = user;
    },
    updateUser(state: State, user: User.Dto) {
      state.Authorization = user.token;
      state.user = user;
    },
    logout(state: State) {
      state.Authorization = null;
      state.user = null;
    },
    updateUserModel(state: dynamicsObject, user: dynamicsObject) {
      if (!state.user) state.user = null;
      for (const key in user) {
        state.user[key] = user[key];
      }
    }
  },
  actions: {
    logout({ commit }: { commit: Commit }) {
      commit('logout');
      localStorage.removeItem('Authorization');
      localStorage.removeItem('user');
      router.push('/auth').then(() => {
        location.reload();
      });
    },
    setLogin({ commit }: { commit: Commit }, user: User.Dto) {
      commit('authorization', user);
      const routes = roleRoutes(user);
      if (!routes) return router.push('/auth');
      router.push(routes[0]);
    },
    checkAuthorization({ commit }: { commit: Commit }) {
      axios
        .get(`/api/authorization`)
        .then((res) => {
          const user = res.data;
          commit('updateUserModel', user);
          if (router.currentRoute.value.name === "Auth") {
            const routes = roleRoutes(user);
            if (!routes) return router.push('/auth');
            router.push(routes[0])
          }
        })
        .catch(() => {
          router.push('/auth');
        });
    },
    correctRoute({ getters }: { getters: dynamicsObject }) {
      if (!getters.user) return router.push('/auth');
      const routes = roleRoutes(getters.user);
      if (!routes) return router.push('/auth');
      router.push(routes[0]);
    }
  },
};