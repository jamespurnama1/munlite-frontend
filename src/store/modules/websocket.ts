import Vue from 'vue';

const socket = {
  state: {
    isConnected: false,
    message: '',
    reconnectError: false,
  },
  mutations: {
    SOCKET_ONOPEN(state, event) {
      Vue.prototype.$socket = event.currentTarget;
      state.isConnected = true;
    },
    SOCKET_ONCLOSE(state) {
      state.isConnected = false;
    },
    SOCKET_ONERROR(state, event) {
      console.error(state, event);
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE(state, message) {
      state.message = JSON.parse(message.data);
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      console.info(state, count);
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.reconnectError = true;
    },
  },
  actions: {
    sendMessage: (context, message) => {
      Vue.prototype.$socket.send(message);
    },
  },
};

export default socket;
