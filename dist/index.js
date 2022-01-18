"use strict";
/*
 * Copyright 2020 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.constants = exports.spinalCategory = exports.spinalGroup = exports.groupManagerService = void 0;
const constants_1 = require("./classes/constants");
exports.constants = constants_1.default;
const GroupManagerService_1 = require("./classes/GroupManagerService");
Object.defineProperty(exports, "spinalGroup", { enumerable: true, get: function () { return GroupManagerService_1.spinalGroup; } });
Object.defineProperty(exports, "spinalCategory", { enumerable: true, get: function () { return GroupManagerService_1.spinalCategory; } });
let groupManagerService = new GroupManagerService_1.default();
exports.groupManagerService = groupManagerService;
exports.default = groupManagerService;
//# sourceMappingURL=index.js.map