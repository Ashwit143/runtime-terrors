"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scoring_js_1 = require("./engine/scoring.js");
const preFilter_js_1 = require("./engine/preFilter.js");
const matchingService_js_1 = require("./engine/matchingService.js");
const seedListings_js_1 = require("./data/seedListings.js");
console.log('🧪 Starting CircularMatch AI Revised Pipeline Verification Suite...\n');
let passedTests = 0;
let totalTests = 0;
function assert(condition, testName, detail) {
    totalTests++;
    if (condition) {
        console.log(`✅ [PASS] ${testName}`);
        passedTests++;
    }
    else {
        console.error(`❌ [FAIL] ${testName} - ${detail || ''}`);
    }
}
// 1. Quantity Fit Asymmetric Curve Verification
console.log('--- 1. Quantity Fit Math Verification ---');
const dummySupplier = {
    id: 's_test',
    type: 'SUPPLIER',
    companyName: 'Supp',
    city: 'Surat',
    category: 'PLASTIC',
    materialName: 'PET',
    quantity: 10,
    unit: 'tonnes',
    qualityGrade: 'HIGH',
    frequency: 'WEEKLY',
    isHazardous: false,
    isHazmatLicensed: false,
};
const dummyReceiver = {
    id: 'r_test',
    type: 'RECEIVER',
    companyName: 'Recv',
    city: 'Surat',
    category: 'PLASTIC',
    materialName: 'PET',
    quantity: 10,
    unit: 'tonnes',
    qualityGrade: 'HIGH',
    frequency: 'WEEKLY',
    isHazardous: false,
    isHazmatLicensed: false,
};
// ratio 1.0 -> 100
dummySupplier.quantity = 10;
dummyReceiver.quantity = 10;
let qf = (0, scoring_js_1.calculateQuantityFit)(dummySupplier, dummyReceiver);
assert(qf.factor.rawScore === 100, 'Quantity Fit: ratio 1.0 = 100', `Got ${qf.factor.rawScore}`);
// ratio 0.75 -> 50
dummySupplier.quantity = 7.5;
dummyReceiver.quantity = 10;
qf = (0, scoring_js_1.calculateQuantityFit)(dummySupplier, dummyReceiver);
assert(qf.factor.rawScore === 50, 'Quantity Fit: ratio 0.75 = 50', `Got ${qf.factor.rawScore}`);
// ratio 0.4 -> 0 (undersupply cutoff)
dummySupplier.quantity = 4;
dummyReceiver.quantity = 10;
qf = (0, scoring_js_1.calculateQuantityFit)(dummySupplier, dummyReceiver);
assert(qf.factor.rawScore === 0, 'Quantity Fit: ratio 0.4 = 0', `Got ${qf.factor.rawScore}`);
// ratio 2.0 -> 50
dummySupplier.quantity = 20;
dummyReceiver.quantity = 10;
qf = (0, scoring_js_1.calculateQuantityFit)(dummySupplier, dummyReceiver);
assert(qf.factor.rawScore === 50, 'Quantity Fit: ratio 2.0 = 50', `Got ${qf.factor.rawScore}`);
// ratio 3.5 -> 0 (oversupply cutoff)
dummySupplier.quantity = 35;
dummyReceiver.quantity = 10;
qf = (0, scoring_js_1.calculateQuantityFit)(dummySupplier, dummyReceiver);
assert(qf.factor.rawScore === 0, 'Quantity Fit: ratio 3.5 = 0', `Got ${qf.factor.rawScore}`);
// 2. Quality Match Asymmetry Verification
console.log('\n--- 2. Quality Match Asymmetry Verification ---');
dummySupplier.qualityGrade = 'HIGH';
dummyReceiver.qualityGrade = 'HIGH';
let qm = (0, scoring_js_1.calculateQualityMatch)(dummySupplier, dummyReceiver);
assert(qm.factor.rawScore === 100, 'Quality Match: High vs High = 100', `Got ${qm.factor.rawScore}`);
dummySupplier.qualityGrade = 'HIGH';
dummyReceiver.qualityGrade = 'MEDIUM';
qm = (0, scoring_js_1.calculateQualityMatch)(dummySupplier, dummyReceiver);
assert(qm.factor.rawScore === 87.5, 'Quality Match: High vs Medium = 87.5', `Got ${qm.factor.rawScore}`);
dummySupplier.qualityGrade = 'LOW';
dummyReceiver.qualityGrade = 'HIGH';
qm = (0, scoring_js_1.calculateQualityMatch)(dummySupplier, dummyReceiver);
assert(qm.factor.rawScore === 0, 'Quality Match: Low vs High = 0', `Got ${qm.factor.rawScore}`);
dummySupplier.qualityGrade = 'MEDIUM';
dummyReceiver.qualityGrade = 'HIGH';
qm = (0, scoring_js_1.calculateQualityMatch)(dummySupplier, dummyReceiver);
assert(qm.factor.rawScore === 30, 'Quality Match: Medium vs High = 30', `Got ${qm.factor.rawScore}`);
// 3. Gate 1 — Hazard Check Verification
console.log('\n--- 3. Gate 1 — Hazard Check Verification ---');
const hazmatSupplier = { ...dummySupplier, isHazardous: true };
const unlicensedReceiver = { ...dummyReceiver, isHazmatLicensed: false };
const licensedReceiver = { ...dummyReceiver, isHazmatLicensed: true };
const preUnlicensed = (0, preFilter_js_1.evaluateHazardGate)(hazmatSupplier, unlicensedReceiver);
assert(!preUnlicensed.isEligible, 'Gate 1: Hazardous supplier + Unlicensed receiver is EXCLUDED');
const preLicensed = (0, preFilter_js_1.evaluateHazardGate)(hazmatSupplier, licensedReceiver);
assert(preLicensed.isEligible, 'Gate 1: Hazardous supplier + Licensed receiver is ELIGIBLE');
// 4. Gate 2 — Material Compatibility Hard Gate Verification
console.log('\n--- 4. Gate 2 — Material Compatibility Hard Gate ---');
const metalSupplier = { ...dummySupplier, category: 'METAL' };
const agroReceiver = { ...dummyReceiver, category: 'FOOD_AGRO' };
const plasticReceiver = { ...dummyReceiver, category: 'PLASTIC' };
const textileReceiver = { ...dummyReceiver, category: 'TEXTILE' };
const matIncompatible = (0, preFilter_js_1.evaluateMaterialGate)(metalSupplier, agroReceiver);
assert(!matIncompatible.isEligible, 'Gate 2: Metal vs Food_Agro (Incompatible) is EXCLUDED ENTIRELY');
const matExact = (0, preFilter_js_1.evaluateMaterialGate)(dummySupplier, plasticReceiver);
assert(matExact.isEligible, 'Gate 2: Plastic vs Plastic (Exact) is ELIGIBLE');
const matAdjacent = (0, preFilter_js_1.evaluateMaterialGate)(dummySupplier, textileReceiver);
assert(matAdjacent.isEligible, 'Gate 2: Plastic vs Textile (Adjacent) is ELIGIBLE');
// 5. Seed Data Pipeline Verification
console.log('\n--- 5. Seed Data Pipeline Verification ---');
const aravalli = seedListings_js_1.SEED_LISTINGS.find(l => l.id === 'supp_001');
const matches = (0, matchingService_js_1.findMatchesForListing)(aravalli, seedListings_js_1.SEED_LISTINGS);
assert(matches.length > 0, `Matching Engine returns ${matches.length} ranked matches for Aravalli Polymers`);
assert(matches[0].score.overallScore >= 70, `Top match score is high: ${matches[0].score.overallScore}/100`);
assert(matches.every(m => m.score.overallScore >= 40), 'Post-Filter: All returned matches have overallScore >= 40');
// Verify descending order
const isSorted = matches.every((m, i) => i === 0 || matches[i - 1].score.overallScore >= m.score.overallScore);
assert(isSorted, 'Ranking: Matches are strictly sorted descending by overallScore');
console.log(`\n🎉 Verification Completed: ${passedTests}/${totalTests} tests passed successfully.`);
