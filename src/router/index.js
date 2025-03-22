import { createWebHistory, createRouter } from 'vue-router';
const Home = () => import(/* webpackChunkName: 'Home' */ '@/views/Home');

const _router = createRouter({
  history: createWebHistory(),
  paramsInheritanceStrategy: 'always',
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
  ]
});

export default _router;
