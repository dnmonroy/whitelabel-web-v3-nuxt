// stores/useSocketIoStore.ts
import { defineStore } from "pinia";
// import { io, Socket } from 'socket.io-client'; // O tu importación de cliente socket

export const useSocketIoStore = defineStore("socketIo", {
  state: () => ({
    socket: null,
    isConnected: false,
  }),
  actions: {
    // Esta acción sería llamada desde un plugin de Nuxt donde inicializas el socket
    initializeSocket(newSocket) {
      this.socket = newSocket;
      // Aquí podrías registrar listeners globales del socket que actualizan este store u otros
    },
    async connectToServer() {
      // const nuxtApp = useNuxtApp(); // Si el socket se provee a través de nuxtApp
      // if (nuxtApp.$socket && !this.isConnected) {
      //   nuxtApp.$socket.connect();
      //   this.isConnected = true;
      //   console.log('Socket connected');
      // }
      console.log("Attempting to connect to socket server...");
      // Lógica de conexión real, por ejemplo:
      // this.socket = io('your-server-url');
      // this.socket.on('connect', () => { this.isConnected = true; });
      // this.socket.on('disconnect', () => { this.isConnected = false; });
    },
    async disconnectFromServer() {
      // if (this.socket && this.isConnected) {
      //   this.socket.disconnect();
      //   this.isConnected = false;
      //   console.log('Socket disconnected');
      // }
      console.log("Attempting to disconnect from socket server...");
    },
    async subscribeToUserChannel() {
      // const userStore = useUserStore();
      // if (this.socket && this.isConnected && userStore.userId) {
      //   this.socket.emit('subscribe', { userId: userStore.userId });
      //   console.log('Subscribed to user channel:', userStore.userId);
      // }
      console.log("Attempting to subscribe to user socket channel...");
    },
    async unsubscribeFromUserChannel() {
      // const userStore = useUserStore();
      // if (this.socket && userStore.userId) { // No necesita estar conectado para intentar desuscribir
      //   this.socket.emit('unsubscribe', { userId: userStore.userId });
      //   console.log('Unsubscribed from user channel:', userStore.userId);
      // }
      console.log("Attempting to unsubscribe from user socket channel...");
    },
  },
});
