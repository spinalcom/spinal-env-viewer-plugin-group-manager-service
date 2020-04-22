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
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const SpinalGroup_1 = require("./SpinalGroup");
const SpinalCategory_1 = require("./SpinalCategory");
class GroupManagerService {
    constructor() {
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
    getGroupĈontexts(contextType) {
        let graphId = spinal_env_viewer_graph_service_1.SpinalGraphService.getGraph().getId().get();
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(graphId).then(contextsModel => {
            let contexts = contextsModel.map(el => el.get());
            let allGroupContexts = contexts.filter(el => {
                return el.type.includes("GroupContext");
            });
            if (typeof contextType === "undefined")
                return allGroupContexts;
            return allGroupContexts.filter(el => {
                return el.type.includes(contextType);
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
        return this.spinalGroup.linkElementToGroup(contextId, groupId, elementId);
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
}
exports.default = GroupManagerService;
//# sourceMappingURL=GroupManagerService.js.map