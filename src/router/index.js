import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../components/LoginPage.vue";
import MedicineManager from "../components/MedicineManager.vue";

const routes = [
  { path: "/", component: LoginPage },
  { path: "/medicines", component: MedicineManager },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
