import { dynamicsObject } from '@/interfaces';
import { ROLES_ENUM } from './enums';

export default (user: dynamicsObject) => {
  const routes = [
    { routes: ['/experts', '/questionnaire'], role: ROLES_ENUM.OWNER },
    { routes: ['/expert/notverified', '/expert/process'], role: ROLES_ENUM.EXPERT },
    { routes: ['/student/works'], role: ROLES_ENUM.STUDENT },
    { routes: ['/expert/students'], role: ROLES_ENUM.SUPPORT },
  ];
  const correct = routes.find(route => route.role === user.role);
  if (!correct) return;
  if (user.accesses.indexOf(ROLES_ENUM.EXPERT) !== -1) correct.routes = [...correct.routes, '/experts'];
  return correct.routes;
};