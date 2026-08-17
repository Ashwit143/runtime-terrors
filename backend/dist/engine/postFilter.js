"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPostFilterAndSort = applyPostFilterAndSort;
const matchingConfig_js_1 = require("../config/matchingConfig.js");
/**
 * Post-Filter:
 * Exclude matches where overallScore < minPassingScore (40).
 * Sort remaining matches descending by overallScore.
 */
function applyPostFilterAndSort(matches) {
    const minScore = matchingConfig_js_1.MATCHING_CONFIG.thresholds.minPassingScore;
    return matches
        .filter(m => m.score.overallScore >= minScore)
        .sort((a, b) => b.score.overallScore - a.score.overallScore);
}
//# sourceMappingURL=postFilter.js.map