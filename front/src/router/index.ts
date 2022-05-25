import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  { path: '/analytics', name: 'Analytics', meta: { layout: 'main' }, component: () => import('../views/Analytics.vue') },
  { path: '/expert/students', name: 'Students', meta: { layout: 'main' }, component: () => import('../views/Students.vue') },
  { path: '/experts', name: 'Expert', meta: { layout: 'main' }, component: () => import('../views/Expert.vue') },
  { path: '/support', name: 'Support', meta: { layout: 'main' }, component: () => import('../views/Support.vue') },
  { path: '/currencies', name: 'Currencies', meta: { layout: 'main' }, component: () => import('../views/Currencies.vue') },
  { path: '/assets', name: 'Assets', meta: { layout: 'main' }, component: () => import('../views/MixedAssets.vue') },
  { path: '/faq', name: 'FAQ', meta: { layout: 'main' }, component: () => import('../views/FAQ.vue') },
  { path: '/instruments', name: 'Instruments', meta: { layout: 'main' }, component: () => import('../views/Instruments.vue') },
  { path: '/questionnaires', name: 'Questionnaires', meta: { layout: 'main' }, component: () => import('../views/Questionnaires.vue') },
  { path: '/questionnaires/archive', name: 'QuestionnairesArchive', meta: { layout: 'main' }, component: () => import('../views/QuestionnairesArchive.vue') },
  { path: '/profile', name: 'Profile', meta: { layout: 'main' }, component: () => import('../views/Profile.vue') },
  { path: '/expert/notverified', name: 'ReportNotVerified', meta: { layout: 'main' }, component: () => import('../views/report/Notverified.vue') },
  { path: '/expert/process', name: 'ReportProcess', meta: { layout: 'main' }, component: () => import('../views/report/Process.vue') },
  { path: '/expert/ready', name: 'ReportReady', meta: { layout: 'main' }, component: () => import('../views/report/Ready.vue') },
  { path: '/preview/:_id', name: 'Preview', meta: { layout: 'preview' }, component: () => import('../views/Preview.vue'), props: true },
  { path: '/questionnaire/:_id', name: 'Questionnaire', meta: { layout: 'questionnaire' }, component: () => import('../views/Questionnaire.vue'), props: true },
  { path: '/questionnaire/:_id/pivot', name: 'QuestionnairePivot', meta: { layout: 'questionnaire' }, component: () => import('../views/QuestionnairePivot.vue'), props: true },

  { path: '/student/works', name: 'StudentWorks', meta: { layout: 'main' }, component: () => import('../views/StudentWorks.vue') },

  { path: '/auth', name: 'Auth', meta: { layout: 'auth' }, component: () => import('../views/Auth.vue') },
  { path: '/auth/password', name: 'AuthPassword', meta: { layout: 'auth' }, component: () => import('../views/AuthPassword.vue') },
  { path: '/new/:token', name: 'New', meta: { layout: 'auth' }, component: () => import('../views/New.vue'), props: true },
  { path: '/reset/:token', name: 'Reset', meta: { layout: 'auth' }, component: () => import('../views/Reset.vue'), props: true },

  { path: "/:catchAll(.*)", redirect: '/auth' }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
