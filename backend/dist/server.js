"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
app_js_1.default.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 CircularMatch AI Engine running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📦 Seed listings active & matching algorithms initialized`);
    console.log(`=======================================================`);
});
exports.default = app_js_1.default;
//# sourceMappingURL=server.js.map