"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.symptomDepartmentOperation = exports.appointmentOperation = exports.doctorOperation = exports.adminOperation = exports.authOperation = exports.BASE_URL = exports.apiClient = exports.getAccessToken = exports.AxonHealthcareUtils = void 0;
var axios_1 = require("axios");
function getAccessToken() {
    if (typeof document === 'undefined')
        return null;
    var cookies = document.cookie.split(';');
    for (var _i = 0, cookies_1 = cookies; _i < cookies_1.length; _i++) {
        var cookie = cookies_1[_i];
        var _a = cookie.trim().split('='), name_1 = _a[0], value = _a[1];
        if (name_1 === 'access_token') {
            return decodeURIComponent(value);
        }
    }
    return null;
}
exports.getAccessToken = getAccessToken;
var BASE_URL = 'http://localhost:8080';
exports.BASE_URL = BASE_URL;
var apiClient = axios_1.default.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
exports.apiClient = apiClient;
apiClient.interceptors.request.use(function (config) {
    var token = getAccessToken();
    if (token) {
        config.headers.Authorization = "Bearer ".concat(token);
    }
    return config;
});
var handleApiError = function (error, operation) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    console.error("Error in ".concat(operation, ":"), (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
    return {
        success: false,
        message: ((_c = (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || (error === null || error === void 0 ? void 0 : error.message) || "An error occurred",
        status: (_d = error === null || error === void 0 ? void 0 : error.response) === null || _d === void 0 ? void 0 : _d.status,
        timestamp: (_f = (_e = error === null || error === void 0 ? void 0 : error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.timestamp,
        error: (_h = (_g = error === null || error === void 0 ? void 0 : error.response) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.error,
    };
};
var AuthOperation = /** @class */ (function () {
    function AuthOperation() {
    }
    /**
     * Admin/Doctor Login
     * POST /api/auth/login
     */
    AuthOperation.prototype.adminLogin = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.post("".concat(BASE_URL, "/api/auth/login"), payload)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, handleApiError(error_1, 'Admin Login')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Patient Registration
     * POST /api/patient/auth/register
     */
    AuthOperation.prototype.patientRegister = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.post("".concat(BASE_URL, "/api/patient/auth/register"), payload)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, handleApiError(error_2, 'Patient Registration')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AuthOperation;
}());
/**
 * Admin Management Operations
 */
var AdminOperation = /** @class */ (function () {
    function AdminOperation() {
    }
    /**
     * Admin Ping Test
     * GET /api/admin/ping
     */
    AdminOperation.prototype.adminPing = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.get('/api/admin/ping')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, handleApiError(error_3, 'Admin Ping')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Admin Registration (Initial setup)
     * POST /api/admin/register
     */
    AdminOperation.prototype.adminRegister = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.post('/api/admin/register', payload)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_4 = _a.sent();
                        return [2 /*return*/, handleApiError(error_4, 'Admin Registration')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get All Patients
     * GET /api/admin/patient
     */
    AdminOperation.prototype.getAllPatients = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.get('/api/admin/patient')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_5 = _a.sent();
                        return [2 /*return*/, handleApiError(error_5, 'Get All Patients')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update Patient
     * PUT /api/admin/patient/{patientId}
     */
    AdminOperation.prototype.updatePatient = function (patientId, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.put("/api/admin/patient/".concat(patientId), payload)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_6 = _a.sent();
                        return [2 /*return*/, handleApiError(error_6, 'Update Patient')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete Patient (Soft Delete)
     * DELETE /api/admin/patient/{patientId}
     */
    AdminOperation.prototype.deletePatient = function (patientId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.delete("/api/admin/patient/".concat(patientId))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                status: response.status,
                            }];
                    case 2:
                        error_7 = _a.sent();
                        return [2 /*return*/, handleApiError(error_7, 'Delete Patient')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get All Departments
     * GET /api/admin/department
     */
    AdminOperation.prototype.getAllDepartments = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.get('/api/admin/department')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_8 = _a.sent();
                        return [2 /*return*/, handleApiError(error_8, 'Get All Departments')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create Department
     * POST /api/admin/department
     */
    AdminOperation.prototype.createDepartment = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.post('/api/admin/department', payload)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_9 = _a.sent();
                        return [2 /*return*/, handleApiError(error_9, 'Create Department')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get Department by ID
     * GET /api/admin/department/{departmentId}
     */
    AdminOperation.prototype.getDepartmentById = function (departmentId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.get("/api/admin/department/".concat(departmentId))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_10 = _a.sent();
                        return [2 /*return*/, handleApiError(error_10, 'Get Department by ID')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update Department
     * PUT /api/admin/department/{departmentId}
     */
    AdminOperation.prototype.updateDepartment = function (departmentId, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.put("/api/admin/department/".concat(departmentId), payload)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_11 = _a.sent();
                        return [2 /*return*/, handleApiError(error_11, 'Update Department')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create Doctor (Admin)
     * POST /api/admin/doctor
     */
    AdminOperation.prototype.createDoctorAdmin = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.post('/api/doctor', payload)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_12 = _a.sent();
                        return [2 /*return*/, handleApiError(error_12, 'Create Doctor (Admin)')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get All Doctors (Admin)
     * GET /api/admin/doctor
     */
    AdminOperation.prototype.getAllDoctorsAdmin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.get('/api/admin/doctor')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_13 = _a.sent();
                        return [2 /*return*/, handleApiError(error_13, 'Get All Doctors (Admin)')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get Doctor by ID (Admin)
     * GET /api/admin/doctor/{id}
     */
    AdminOperation.prototype.getDoctorByIdAdmin = function (doctorId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.get("/api/admin/doctor/".concat(doctorId))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_14 = _a.sent();
                        return [2 /*return*/, handleApiError(error_14, 'Get Doctor by ID (Admin)')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update Doctor (Admin)
     * PUT /api/admin/doctor/{id}
     */
    AdminOperation.prototype.updateDoctorAdmin = function (doctorId, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.put("/api/admin/doctor/".concat(doctorId), payload)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_15 = _a.sent();
                        return [2 /*return*/, handleApiError(error_15, 'Update Doctor (Admin)')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete Doctor (Admin - Soft Delete)
     * DELETE /api/admin/doctor/{id}
     */
    AdminOperation.prototype.deleteDoctorAdmin = function (doctorId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.delete("/api/admin/doctor/".concat(doctorId))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                status: response.status,
                            }];
                    case 2:
                        error_16 = _a.sent();
                        return [2 /*return*/, handleApiError(error_16, 'Delete Doctor (Admin)')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get All Symptoms (Admin)
     * GET /api/admin/symptom
     */
    AdminOperation.prototype.getAllSymptomsAdmin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.get('/api/admin/symptom')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_17 = _a.sent();
                        return [2 /*return*/, handleApiError(error_17, 'Get All Symptoms (Admin)')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get Symptom by ID (Admin)
     * GET /api/admin/symptom/{id}
     */
    AdminOperation.prototype.getSymptomByIdAdmin = function (symptomId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.get("/api/admin/symptom/".concat(symptomId))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_18 = _a.sent();
                        return [2 /*return*/, handleApiError(error_18, 'Get Symptom by ID (Admin)')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Add New Symptom (Admin)
     * POST /api/admin/symptom
     */
    AdminOperation.prototype.createSymptomAdmin = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.post('/api/admin/symptom', payload)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_19 = _a.sent();
                        return [2 /*return*/, handleApiError(error_19, 'Create Symptom (Admin)')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update Symptom (Admin)
     * PUT /api/admin/symptom/{id}
     */
    AdminOperation.prototype.updateSymptomAdmin = function (symptomId, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.put("/api/admin/symptom/".concat(symptomId), payload)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_20 = _a.sent();
                        return [2 /*return*/, handleApiError(error_20, 'Update Symptom (Admin)')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete Symptom (Admin)
     * DELETE /api/admin/symptom/{id}
     */
    AdminOperation.prototype.deleteSymptomAdmin = function (symptomId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.delete("/api/admin/symptom/".concat(symptomId))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                status: response.status,
                            }];
                    case 2:
                        error_21 = _a.sent();
                        return [2 /*return*/, handleApiError(error_21, 'Delete Symptom (Admin)')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AdminOperation;
}());
var DoctorOperation = /** @class */ (function () {
    function DoctorOperation() {
    }
    /**
     * Get Doctors by Department
     * GET /doctor?departmentId={id}
     */
    DoctorOperation.prototype.getDoctorsByDepartment = function (departmentId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.get("/doctor?departmentId=".concat(departmentId))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_22 = _a.sent();
                        return [2 /*return*/, handleApiError(error_22, 'Get Doctors by Department')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create Doctor Profile (Admin only)
     * POST /doctor/create
     */
    DoctorOperation.prototype.createDoctor = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.post('/doctor/create', payload)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_23 = _a.sent();
                        return [2 /*return*/, handleApiError(error_23, 'Create Doctor')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return DoctorOperation;
}());
var AppointmentOperation = /** @class */ (function () {
    function AppointmentOperation() {
    }
    /**
     * Get Available Time Slots (Patient only)
     * GET /appointment/available?doctorId={id}&date={yyyy-MM-dd}
     */
    AppointmentOperation.prototype.getAvailableTimeSlots = function (doctorId, date) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.get("/appointment/available?doctorId=".concat(doctorId, "&date=").concat(date))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_24 = _a.sent();
                        return [2 /*return*/, handleApiError(error_24, 'Get Available Time Slots')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get Patient Appointments (Patient only)
     * GET /appointment/patient
     */
    AppointmentOperation.prototype.getPatientAppointments = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.get('/appointment/patient')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_25 = _a.sent();
                        return [2 /*return*/, handleApiError(error_25, 'Get Patient Appointments')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get Doctor Appointments (Doctor only)
     * GET /appointment/doctor
     */
    AppointmentOperation.prototype.getDoctorAppointments = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.get('/appointment/doctor')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_26 = _a.sent();
                        return [2 /*return*/, handleApiError(error_26, 'Get Doctor Appointments')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create Appointment (Patient only)
     * POST /appointment/create
     */
    AppointmentOperation.prototype.createAppointment = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.post('/appointment/create', payload)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_27 = _a.sent();
                        return [2 /*return*/, handleApiError(error_27, 'Create Appointment')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Cancel Appointment
     * PUT /appointment/{id}/cancel
     */
    AppointmentOperation.prototype.cancelAppointment = function (appointmentId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.put("/appointment/".concat(appointmentId, "/cancel"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_28 = _a.sent();
                        return [2 /*return*/, handleApiError(error_28, 'Cancel Appointment')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Reschedule Appointment
     * PUT /appointment/{id}/reschedule
     */
    AppointmentOperation.prototype.rescheduleAppointment = function (appointmentId, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_29;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.put("/appointment/".concat(appointmentId, "/reschedule"), payload)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_29 = _a.sent();
                        return [2 /*return*/, handleApiError(error_29, 'Reschedule Appointment')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get time slot display text
     * Helper function to convert time slot number to readable time
     */
    AppointmentOperation.prototype.getTimeSlotDisplay = function (timeSlot) {
        var timeSlots = {
            1: '08:00-08:30',
            2: '08:30-09:00',
            3: '09:00-09:30',
            4: '09:30-10:00',
            5: '10:00-10:30',
            6: '10:30-11:00',
            7: '11:00-11:30',
            8: '11:30-12:00',
            9: '13:00-13:30',
            10: '13:30-14:00',
            11: '14:00-14:30',
            12: '14:30-15:00',
            13: '15:00-15:30',
            14: '15:30-16:00',
            15: '16:00-16:30',
            16: '16:30-17:00',
        };
        return timeSlots[timeSlot] || 'Invalid time slot';
    };
    return AppointmentOperation;
}());
var SymptomDepartmentOperation = /** @class */ (function () {
    function SymptomDepartmentOperation() {
    }
    /**
     * Get All Symptoms
     * GET /symptoms/names
     */
    SymptomDepartmentOperation.prototype.getAllSymptoms = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_30;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.get('/symptoms/names')];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_30 = _a.sent();
                        return [2 /*return*/, handleApiError(error_30, 'Get All Symptoms')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Suggest Department by Symptoms
     * POST /department/suggest
     */
    SymptomDepartmentOperation.prototype.suggestDepartmentBySymptoms = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_31;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.post('/department/suggest', payload)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: response.data,
                                status: response.status,
                            }];
                    case 2:
                        error_31 = _a.sent();
                        return [2 /*return*/, handleApiError(error_31, 'Suggest Department by Symptoms')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SymptomDepartmentOperation;
}());
var AxonHealthcareUtils = /** @class */ (function () {
    function AxonHealthcareUtils() {
    }
    /**
     * Format date to yyyy-MM-dd format required by API
     */
    AxonHealthcareUtils.formatDateForAPI = function (date) {
        return date.toISOString().split('T')[0];
    };
    /**
     * Parse API date string to Date object
     */
    AxonHealthcareUtils.parseAPIDate = function (dateString) {
        return new Date(dateString);
    };
    /**
     * Check if user has required role
     */
    AxonHealthcareUtils.hasRole = function (requiredRole) {
        var token = getAccessToken();
        if (!token)
            return false;
        try {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(atob(base64)
                .split('')
                .map(function (c) { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); })
                .join(''));
            var payload = JSON.parse(jsonPayload);
            return payload.role === requiredRole;
        }
        catch (error) {
            return false;
        }
    };
    /**
     * Get user role from token
     */
    AxonHealthcareUtils.getUserRole = function () {
        var token = getAccessToken();
        if (!token)
            return null;
        try {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(atob(base64)
                .split('')
                .map(function (c) { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); })
                .join(''));
            var payload = JSON.parse(jsonPayload);
            return payload.role;
        }
        catch (error) {
            return null;
        }
    };
    /**
     * Check if token is expired
     */
    AxonHealthcareUtils.isTokenExpired = function () {
        var token = getAccessToken();
        if (!token)
            return true;
        try {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(atob(base64)
                .split('')
                .map(function (c) { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); })
                .join(''));
            var payload = JSON.parse(jsonPayload);
            var currentTime = Math.floor(Date.now() / 1000);
            return payload.exp < currentTime;
        }
        catch (error) {
            return true;
        }
    };
    return AxonHealthcareUtils;
}());
exports.AxonHealthcareUtils = AxonHealthcareUtils;
// Create instances for export
var authOperation = new AuthOperation();
exports.authOperation = authOperation;
var adminOperation = new AdminOperation();
exports.adminOperation = adminOperation;
var doctorOperation = new DoctorOperation();
exports.doctorOperation = doctorOperation;
var appointmentOperation = new AppointmentOperation();
exports.appointmentOperation = appointmentOperation;
var symptomDepartmentOperation = new SymptomDepartmentOperation();
exports.symptomDepartmentOperation = symptomDepartmentOperation;
