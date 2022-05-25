"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (term) => {
    const terms = [
        { id: 'MONTH', desc: ['месяцев', 'месяц', 'месяца'] },
        { id: 'YEAR', desc: ['лет', 'год', 'года'] },
        { id: 'DAYS', desc: ['дней', 'день', 'дня'] },
    ];
    const correct = terms.find(t => t.id === term.duration_id);
    return getDescription(term.term, correct.desc);
};
function getDescription(currVal, objDesc) {
    if (currVal <= 10 || currVal >= 20) {
        if (currVal % 10 === 1)
            return objDesc[1];
        else if ((currVal % 10 >= 2) && (currVal % 10 <= 4))
            return objDesc[2];
    }
    return objDesc[0];
}
//# sourceMappingURL=correctEnd.js.map