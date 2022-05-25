import { Questionnaire } from "@/interfaces/dto/questionnaire";

export default (questionnaire: Questionnaire.Content) => {
  const result: any = {};
  const keys = Object.typedKeys(questionnaire);
  for (const key of keys) {
    if (Object.hasOwnProperty.call(questionnaire, key)) {
      const module = questionnaire[key];
      result[key] = {
        id: key,
        data: generateModule(module)
      }
    }
  }
  return result;
}

function generateModule(m: any) {
  if (m.module) return { module: { data: m.module.data } };
  return m.map((target: Questionnaire.QTarget) => ({
    id: target.id,
    status: target.status,
    name: target.name,
    main: { data: target.main.data },
    type: {
      id: target.type.id,
      name: target.type.name,
      sections: target.type.sections.map(s => ({
        modules: s.modules.map(m => ({
          data: m.data,
        })),
        default: s.default
      }))
    },
    conclusion: {
      sections: target.conclusion.sections.map(s => ({
        modules: s.modules.map(m => ({
          data: m.data,
        })),
        default: s.default
      }))
    },
    portfolios: {
      existing: {
        sections: target.portfolios.existing.sections.map(s => ({
          modules: s.modules.map(m => ({
            data: m.data,
          })),
          default: s.default,
          optional: s.optional,
          selected: s.selected,
          files: s.files
        }))
      },
      student: {
        sections: target.portfolios.student.sections.map(s => ({
          modules: s.modules.map(m => ({
            data: m.data,
          })),
          default: s.default,
          optional: s.optional,
          selected: s.selected,
          files: s.files
        }))
      },
      expert: {
        sections: target.portfolios.expert.sections.map(s => ({
          modules: s.modules.map(m => ({
            data: m.data,
          })),
          default: s.default
        }))
      }
    }
  }));
}