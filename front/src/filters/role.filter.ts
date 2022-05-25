import { dynamicsObject } from '@/interfaces';
import { ROLES_ENUM } from '../utils/enums';

export default function roleFilter(user: dynamicsObject) {
  const roles = [
    { name: "эксперт", value: ROLES_ENUM.EXPERT },
    { name: "владелец", value: ROLES_ENUM.OWNER },
    { name: "студент", value: ROLES_ENUM.STUDENT },
    { name: "служба поддержки", value: ROLES_ENUM.SUPPORT },
  ];
  const correct = roles.find(r => r.value === user.role);
  if (user.role === ROLES_ENUM.EXPERT && user.accesses.includes(ROLES_ENUM.EXPERT)) return 'старший эксперт';
  return correct ? correct.name : 'не найдено';
}