import { createApp, defineAsyncComponent } from 'vue';
import "bootstrap/dist/css/bootstrap.css";
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

const App = defineAsyncComponent(() => import('@/App'));
const app = createApp(App);
const router = require('@/router').default;

app.use(router);
app.config.globalProperties.$bootstrap = bootstrap;

router.isReady().then(() => {
  app.mount('#app');
});
