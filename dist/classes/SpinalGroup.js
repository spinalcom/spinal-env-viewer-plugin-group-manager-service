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
const constants_1 = require("./constants");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinal_env_viewer_context_geographic_service_1 = require("spinal-env-viewer-context-geographic-service");
const spinal_model_bmsnetwork_1 = require("spinal-model-bmsnetwork");
class SpinalGroup {
    constructor() {
        this.CATEGORY_TO_GROUP_RELATION = constants_1.CATEGORY_TO_GROUP_RELATION;
        this.RELATION_BEGIN = constants_1.GROUP_RELATION_BEGIN;
    }
    addGroup(contextId, categoryId, groupName, groupColor, groupIcon = "3d_rotation") {
        return __awaiter(this, void 0, void 0, function* () {
            const groupFound = yield this._groupNameExist(categoryId, groupName);
            if (groupFound) {
                return spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(groupFound.id.get());
            }
            let contextInfo = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(contextId);
            if (contextInfo) {
                let info = {
                    name: groupName,
                    type: `${this._getChildrenType(contextInfo.type.get())}Group`,
                    color: groupColor ? groupColor : "#000000",
                    icon: groupIcon
                };
                let childId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(info, new spinal_core_connectorjs_type_1.Model({
                    name: groupName
                }));
                return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(categoryId, childId, contextId, this.CATEGORY_TO_GROUP_RELATION, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
            }
            // return Promise.resolve(false);
        });
    }
    linkElementToGroup(contextId, groupId, elementId) {
        return __awaiter(this, void 0, void 0, function* () {
            let contextInfo = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(contextId);
            let elementInfo = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(elementId);
            if (contextInfo && elementInfo) {
                let childrenType = this._getChildrenType(contextInfo.type.get());
                if (childrenType === elementInfo.type.get() || this._isOldGroup(contextInfo.type.get(), elementInfo.type.get()))
                    return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(groupId, elementId, contextId, `${this.RELATION_BEGIN}${elementInfo.type.get()}`, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
            }
            throw Error(`${elementInfo.type.get()} cannot be linked to this group.`);
        });
    }
    elementIsLinkedToGroup(groupId, elementId) {
        let childrenIds = spinal_env_viewer_graph_service_1.SpinalGraphService.getChildrenIds(groupId);
        return childrenIds.indexOf(elementId) !== -1;
    }
    unLinkElementToGroup(groupId, elementId) {
        return __awaiter(this, void 0, void 0, function* () {
            let elementInfo = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(elementId);
            let relationName = `${this.RELATION_BEGIN}${elementInfo.type.get()}`;
            let result;
            try {
                result = yield spinal_env_viewer_graph_service_1.SpinalGraphService.removeChild(groupId, elementId, relationName, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
            }
            catch (error) {
                result = yield spinal_env_viewer_graph_service_1.SpinalGraphService.removeChild(groupId, elementId, relationName, spinal_env_viewer_graph_service_1.SPINAL_RELATION_LST_PTR_TYPE);
            }
            if (!result) {
                const groupInfo = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(groupId);
                relationName = this._getGroupRelation(groupInfo.type.get());
                return spinal_env_viewer_graph_service_1.SpinalGraphService.removeChild(groupId, elementId, relationName, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
            }
        });
    }
    getElementsLinkedToGroup(groupId) {
        let groupInfo = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(groupId);
        let type = this._getChildrenType(groupInfo.type.get());
        let relationNames = [`${this.RELATION_BEGIN}${type}`];
        const tempRel = this._getGroupRelation(groupInfo.type.get());
        if (typeof tempRel !== "undefined")
            relationNames.push(tempRel);
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(groupId, relationNames);
    }
    getGroups(nodeId) {
        let nodeInfo = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(nodeId);
        if (this._isGroup(nodeInfo.type.get())) {
            return Promise.resolve([nodeInfo]);
        }
        let relations = [
            constants_1.CONTEXT_TO_CATEGORY_RELATION,
            constants_1.CATEGORY_TO_GROUP_RELATION,
            `${this.RELATION_BEGIN}${nodeInfo.type.get()}`,
            constants_1.OLD_RELATIONS_TYPES.GROUP_TO_ENDPOINT_RELATION,
            constants_1.OLD_RELATIONS_TYPES.GROUP_TO_EQUIPMENTS_RELATION,
            constants_1.OLD_RELATIONS_TYPES.GROUP_TO_ROOMS_RELATION
        ];
        return spinal_env_viewer_graph_service_1.SpinalGraphService.findNodes(nodeId, relations, (node) => {
            let argType = node.getType().get();
            return this._isGroup(argType);
        }).then(res => {
            return res.map(el => {
                spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(el);
                return spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(el.getId().get());
            });
        });
    }
    getCategory(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const parents = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getParents(groupId, this.CATEGORY_TO_GROUP_RELATION);
            if (parents.length > 0)
                return parents[0];
        });
    }
    updateGroup(groupId, newInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            let realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(groupId);
            for (const key in newInfo) {
                if (newInfo.hasOwnProperty(key)) {
                    const value = newInfo[key];
                    if (realNode.info[key]) {
                        realNode.info[key].set(value);
                    }
                    else {
                        realNode.info.add_attr({
                            [key]: value
                        });
                    }
                }
            }
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(realNode.getId().get());
        });
    }
    _isGroup(type) {
        // let stringEnd = type.substr(type.length - 5);
        // return stringEnd === "Group";
        return /Group$/.test(type);
    }
    checkGroupType(groupType, childrenType) {
        return groupType === `${childrenType}Group`;
    }
    ////////////////////////////////////////////////////////////////////
    //                      PRIVATES                                  //
    ////////////////////////////////////////////////////////////////////
    _getChildrenType(elementType) {
        if (elementType.toLowerCase() === constants_1.OLD_CONTEXTS_TYPES.ROOMS_GROUP_CONTEXT.toLowerCase() || elementType.toLowerCase() === constants_1.OLD_GROUPS_TYPES.ROOMS_GROUP.toLowerCase()) {
            return spinal_env_viewer_context_geographic_service_1.default.constants.ROOM_TYPE;
        }
        else if (elementType.toLowerCase() === constants_1.OLD_CONTEXTS_TYPES.EQUIPMENTS_GROUP_CONTEXT.toLowerCase() || elementType.toLowerCase() === constants_1.OLD_GROUPS_TYPES.EQUIPMENTS_GROUP.toLowerCase()) {
            return spinal_env_viewer_context_geographic_service_1.default.constants.EQUIPMENT_TYPE;
        }
        else if (elementType.toLowerCase() === constants_1.OLD_CONTEXTS_TYPES.ENDPOINTS_GROUP_CONTEXT.toLowerCase() || elementType.toLowerCase() === constants_1.OLD_GROUPS_TYPES.ENDPOINT_GROUP.toLowerCase()) {
            return spinal_model_bmsnetwork_1.SpinalBmsEndpoint.nodeTypeName;
        }
        else {
            if (/GroupContext$/.test(elementType))
                return elementType.replace("GroupContext", "");
            else if (/Group$/.test(elementType))
                return elementType.replace("Group", "");
            throw new Error(`${elementType} is not a group element type`);
        }
    }
    _isOldGroup(contextType, elementType) {
        const isRoomGroup = contextType === constants_1.OLD_CONTEXTS_TYPES.ROOMS_GROUP_CONTEXT && elementType === spinal_env_viewer_context_geographic_service_1.default.constants.ROOM_TYPE;
        const isEquipementGroup = contextType === constants_1.OLD_CONTEXTS_TYPES.EQUIPMENTS_GROUP_CONTEXT && elementType === spinal_env_viewer_context_geographic_service_1.default.constants.EQUIPMENT_TYPE;
        const isEndpointGroup = contextType === constants_1.OLD_CONTEXTS_TYPES.ENDPOINTS_GROUP_CONTEXT && elementType === spinal_model_bmsnetwork_1.SpinalBmsEndpoint.nodeTypeName;
        console.log(isRoomGroup, isEquipementGroup, isEndpointGroup);
        return isRoomGroup || isEquipementGroup || isEndpointGroup;
    }
    _groupNameExist(nodeId, groupName) {
        return __awaiter(this, void 0, void 0, function* () {
            const groups = yield this.getGroups(nodeId);
            for (const group of groups) {
                const name = group.name.get();
                if (name === groupName)
                    return group;
            }
        });
    }
    _getGroupRelation(type) {
        let relationName;
        switch (type.toLowerCase()) {
            case constants_1.OLD_GROUPS_TYPES.ROOMS_GROUP.toLowerCase():
                relationName = constants_1.OLD_RELATIONS_TYPES.GROUP_TO_ROOMS_RELATION;
                break;
            case constants_1.OLD_GROUPS_TYPES.EQUIPMENTS_GROUP.toLowerCase():
                relationName = constants_1.OLD_RELATIONS_TYPES.GROUP_TO_EQUIPMENTS_RELATION;
                break;
            case constants_1.OLD_GROUPS_TYPES.EQUIPMENTS_GROUP.toLowerCase():
                relationName = constants_1.OLD_RELATIONS_TYPES.GROUP_TO_ENDPOINT_RELATION;
                break;
        }
        return relationName;
    }
}
exports.default = SpinalGroup;
//# sourceMappingURL=SpinalGroup.js.map