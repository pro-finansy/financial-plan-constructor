import { ROLES_ENUM } from '@/utils/enums';

const comment = (role: keyof typeof ROLES_ENUM, comment: string) => ({
  data: {
    comment
  },
  inputs: [
    { show: true, id: 'comment', placeholder: 'Итоговый комментарий эксперта по портфелю', type: 'textarea', drop: false, error: false, required: role === ROLES_ENUM.EXPERT },
  ]
});

export default (role: keyof typeof ROLES_ENUM = ROLES_ENUM.STUDENT, comments = { common: '' }) => {
  return {
    id: 'comment',
    name: 'Общий комментарий эксперта',
    module: comment(role, comments.common)
  }
};