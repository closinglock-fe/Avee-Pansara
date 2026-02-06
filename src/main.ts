import { createApp } from 'vue';
import App from './components/App.vue';

const root = document.getElementById('app'); 
const app = createApp(App);
app.mount(root!);
