import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $connect(url:string): JSON,
    $disconnect(): JSON,
    $socket: socket,
  }

  interface socket {
    send(data: string): JSON;
    sendObj(): JSON;
  }
}

// export type storeHandler<T = any> = (
//   eventName: string,
//   event: {
//     data: string;
//     mutation: string;
//     namespace: string;
//     action: string;
//   },
//   opts?: T,
// ) => void;

// export type websocketOpts<T = any> = {
//   format: string;
//   reconnection?: boolean;
//   reconnectionAttempts?: number;
//   reconnectionDelay?: number;
//   connectManually?: boolean;
//   passToStoreHandler?: storeHandler;
//   store?: T;
//   mutations?: T;
//   protocol?: string;
//   WebSocket?: WebSocket;
//   $setInstance?: (event: EventTarget) => void;
// };
