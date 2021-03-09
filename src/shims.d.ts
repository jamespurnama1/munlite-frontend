import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $connect(url:string): JSON,
    $disconnect(): JSON,
    $socket: WebSocket,
  }

  interface socket {
    send(data: string): JSON;
    sendObj(): JSON;
  }
}
