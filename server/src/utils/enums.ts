export enum STATUSES {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  SERVER = 500,
}

export enum ROLES {
  ADMIN = 'ADMIN',
  EXPERT = 'EXPERT',
  STUDENT = 'STUDENT',
  OWNER = 'OWNER',
  SUPPORT = 'SUPPORT',
}

export enum COURSES {
  ONE = 'one',
  TWO = 'two',
};

export enum QUESTIONNAIRE_STATUSES {
  NOTSENT = 'NOTSENT',
  NOTVERIFIED = 'NOTVERIFIED',
  PROCESS = 'PROCESS',
  VERIFIED = 'VERIFIED',
  SENDED = 'SENDED',
  process = 'process',
  ready = 'ready',
};

export enum COURSES_STATUSES {
  NOTSENT = 'NOTSENT',
  SENT = 'SENT',
  PROCESS = 'PROCESS',
  VERIFIED = 'VERIFIED',
};

export enum CORSES_STATUSES_NAME {
  NOTSENT = 'Не сдано',
  SENT = 'Сдано',
  PROCESS = 'На проверке',
  VERIFIED = 'Готово',
}

export enum QUESTIONNAIRE_VERSIONS {
  NEW = 'new',
  OLD = 'old',
}

export enum FILES {
  AVATAR = 'AVATAR',
  TEACH_MATERIAL = 'TEACH_MATERIAL',
  DOCUMENT = 'DOCUMENT',
  QUESTIONNAIRE = 'QUESTIONNAIRE',
  REPORT = 'REPORT',
  TACTIC = 'TACTIC',
};

export enum PAPER {
  STOCK = 'STOCK',
  BOND = 'BOND',
  FUND = 'FUND',
};

export enum ACCESSES {
  HOMEWORK = 'HOMEWORK',
  EXPERTS = 'EXPERTS',
  INVESTMENT = 'INVESTMENT',
};

export enum PERIODS {
  MONTHLY = 'мес.',
  QUARTERLY = 'кварт.',
  ANNUALLY = 'год',
};