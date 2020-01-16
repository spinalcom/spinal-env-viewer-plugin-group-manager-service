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
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constants_1 = require("./constants");
class SpinalGroup {
    constructor() {
        this.CATEGORY_TO_GROUP_RELATION = constants_1.CATEGORY_TO_GROUP_RELATION;
    }
    addGroup(contextId, categoryId, groupName, groupColor) {
        let contextInfo = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(contextId);
        if (contextInfo) {
            let info = {
                name: groupName,
                type: `${this._getChildrenType(contextInfo.type.get())}Group`,
                color: groupColor ? groupColor : "#000000"
            };
            let childId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(info, new spinal.Model({
                name: groupName
            }));
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(categoryId, childId, contextId, this.CATEGORY_TO_GROUP_RELATION, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
        }
        return Promise.resolve(false);
    }
    linkElementToGroup(contextId, groupId, elementId) {
        let groupInfo = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(groupId);
        let elementInfo = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(elementId);
        if (groupInfo && elementInfo) {
            let childrenType = this._getChildrenType(groupInfo.type.get());
            if (childrenType === elementInfo.type.get())
                return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(groupId, elementId, contextId, `groupHas${elementInfo.type.get()}`, spinal_env_viewer_graph_service_1.SPINAL_RELATION_LST_PTR_TYPE);
        }
        throw Error(`${elementInfo.type.get()} cannot be linked to this group.`);
    }
    elementIsLinkedToGroup(groupId, elementId) {
        let childrenIds = spinal_env_viewer_graph_service_1.SpinalGraphService.getChildrenIds(groupId);
        return childrenIds.indexOf(elementId) !== -1;
    }
    unLinkElementToGroup(groupId, elementId) {
        let elementInfo = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(elementId);
        let relationName = `groupHas${elementInfo.type.get()}`;
        return spinal_env_viewer_graph_service_1.SpinalGraphService.removeChild(groupId, elementId, relationName, spinal_env_viewer_graph_service_1.SPINAL_RELATION_LST_PTR_TYPE);
    }
    getElementsLinkedToGroup(groupId) {
        let groupInfo = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(groupId);
        let type = this._getChildrenType(groupInfo.type.get());
        let relationName = `groupHas${type}`;
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(groupId, [relationName]);
    }
    getGroups(nodeId) {
        let nodeInfo = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(nodeId);
        if (this._isGroup(nodeInfo.type.get())) {
            return Promise.resolve([nodeInfo]);
        }
        let relations = [
            constants_1.CONTEXT_TO_CATEGORY_RELATION,
            constants_1.CATEGORY_TO_GROUP_RELATION,
            `groupHas${nodeInfo.type.get()}`
        ];
        return spinal_env_viewer_graph_service_1.SpinalGraphService.findNodes(nodeId, relations, (node) => {
            let argType = node.getType().get();
            return this._isGroup(argType);
        }).then(res => {
            return res.map(el => {
                spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(el);
                return el.info;
            });
        });
    }
    ////////////////////////////////////////////////////////////////////
    //                      PRIVATES                                  //
    ////////////////////////////////////////////////////////////////////
    _getChildrenType(elementType) {
        return elementType.includes("GroupContext") ? elementType.replace("GroupContext", "") : elementType.replace("Group", "");
    }
    _isGroup(type) {
        let stringEnd = type.substr(type.length - 5);
        return stringEnd === "Group";
    }
}
exports.default = SpinalGroup;
//# sourceMappingURL=SpinalGroup.js.map