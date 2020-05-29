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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinal_env_viewer_context_geographic_service_1 = require("spinal-env-viewer-context-geographic-service");
const spinal_model_bmsnetwork_1 = require("spinal-model-bmsnetwork");
const SpinalGroup_1 = require("./SpinalGroup");
const SpinalCategory_1 = require("./SpinalCategory");
const constants_1 = require("./constants");
class GroupManagerService {
    constructor() {
        this.constants = constants_1.default;
        this.spinalGroup = new SpinalGroup_1.default();
        this.spinalCategory = new SpinalCategory_1.default();
    }
    createGroupContext(contextName, childrenType) {
        const contextFound = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(contextName);
        if (typeof contextFound !== "undefined")
            return Promise.resolve(contextFound);
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addContext(contextName, `${childrenType}GroupContext`, new spinal_core_connectorjs_type_1.Model({
            name: contextName,
            childType: childrenType
        }));
    }
    getGroupContexts(childType) {
        let graphId = spinal_env_viewer_graph_service_1.SpinalGraphService.getGraph().getId().get();
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(graphId).then(contextsModel => {
            let contexts = contextsModel.map(el => el.get());
            let allGroupContexts = contexts.filter(el => {
                return el.type.includes("GroupContext");
            });
            if (typeof childType === "undefined")
                return allGroupContexts;
            const oldType = this._getOldTypes(childType);
            return allGroupContexts.filter(el => {
                return el.type.includes(childType) || el.type === oldType;
            });
        });
    }
    addCategory(contextId, categoryName, iconName) {
        return this.spinalCategory.addCategory(contextId, categoryName, iconName);
    }
    getCategories(nodeId) {
        return this.spinalCategory.getCategories(nodeId);
    }
    addGroup(contextId, categoryId, groupName, groupColor) {
        return this.spinalGroup.addGroup(contextId, categoryId, groupName, groupColor);
    }
    getGroups(nodeId) {
        return this.spinalGroup.getGroups(nodeId);
    }
    linkElementToGroup(contextId, groupId, elementId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.getGroupCategory(groupId);
            const group = yield this.elementIsInCategorie(category.id.get(), elementId);
            const result = { old_group: undefined, newGroup: groupId };
            if (typeof group !== "undefined") {
                this.unLinkElementToGroup(group.id.get(), elementId);
                result.old_group = group.id.get();
            }
            yield this.spinalGroup.linkElementToGroup(contextId, groupId, elementId);
            return result;
        });
    }
    elementIsLinkedToGroup(groupId, elementId) {
        return this.spinalGroup.elementIsLinkedToGroup(groupId, elementId);
    }
    elementIsInCategorie(categoryId, elementId) {
        return this.spinalCategory.elementIsInCategorie(categoryId, elementId);
    }
    unLinkElementToGroup(groupId, elementId) {
        return this.spinalGroup.unLinkElementToGroup(groupId, elementId);
    }
    getElementsLinkedToGroup(groupId) {
        return this.spinalGroup.getElementsLinkedToGroup(groupId);
    }
    getGroupCategory(groupId) {
        return this.spinalGroup.getCategory(groupId);
    }
    isContext(type) {
        return this.spinalCategory._isContext(type);
    }
    isCategory(type) {
        return this.spinalCategory._isCategory(type);
    }
    isGroup(type) {
        return this.spinalGroup._isGroup(type);
    }
    isRoomsGroup(type) {
        return type == `${spinal_env_viewer_context_geographic_service_1.default.constants.ROOM_TYPE}Group` || constants_1.OLD_CONTEXTS_TYPES.ROOMS_GROUP_CONTEXT.replace("Context", "") == type || type === constants_1.OLD_GROUPS_TYPES.ROOMS_GROUP;
    }
    isEquipementGroup(type) {
        return type == `${spinal_env_viewer_context_geographic_service_1.default.constants.EQUIPMENT_TYPE}Group` || constants_1.OLD_CONTEXTS_TYPES.EQUIPMENTS_GROUP_CONTEXT.replace("Context", "") == type || type === constants_1.OLD_GROUPS_TYPES.EQUIPMENTS_GROUP;
    }
    isEndpointGroup(type) {
        return;
    }
    updateCategory(categoryId, dataObject) {
        return this.spinalCategory.updateCategory(categoryId, dataObject);
    }
    updateGroup(categoryId, dataObject) {
        return this.spinalGroup.updateGroup(categoryId, dataObject);
    }
    ////////////////////////////////////////////////////////////////////
    //                      PRIVATES                                  //
    ////////////////////////////////////////////////////////////////////
    _getOldTypes(type) {
        switch (type) {
            case spinal_env_viewer_context_geographic_service_1.default.constants.ROOM_TYPE:
                return this.constants.OLD_CONTEXTS_TYPES.ROOMS_GROUP_CONTEXT;
            case spinal_env_viewer_context_geographic_service_1.default.constants.EQUIPMENT_TYPE:
                return this.constants.OLD_CONTEXTS_TYPES.EQUIPMENTS_GROUP_CONTEXT;
            case spinal_model_bmsnetwork_1.SpinalBmsEndpoint.nodeTypeName:
                return this.constants.OLD_CONTEXTS_TYPES.ENDPOINTS_GROUP_CONTEXT;
        }
    }
}
exports.default = GroupManagerService;
//# sourceMappingURL=GroupManagerService.js.map