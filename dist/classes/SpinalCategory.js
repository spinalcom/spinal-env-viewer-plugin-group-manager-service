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
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
class SpinalCategory {
    constructor() {
        this.CATEGORY_TYPE = constants_1.CATEGORY_TYPE;
        this.CONTEXT_TO_CATEGORY_RELATION = constants_1.CONTEXT_TO_CATEGORY_RELATION;
    }
    addCategory(contextId, categoryName, iconName) {
        let info = {
            name: categoryName,
            type: this.CATEGORY_TYPE,
            icon: iconName
        };
        let childId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(info, new spinal_core_connectorjs_type_1.Model({
            name: categoryName
        }));
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(contextId, childId, contextId, this.CONTEXT_TO_CATEGORY_RELATION, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
    }
    getCategories(nodeId) {
        let nodeInfo = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(nodeId);
        if (this._isCategory(nodeInfo.type.get())) {
            return Promise.resolve([nodeInfo]);
        }
        else if (this._isContext(nodeInfo.type.get())) {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(nodeId, [this.CONTEXT_TO_CATEGORY_RELATION]);
        }
        else {
            return this._getRelationRefs(nodeId).then(refs => {
                let promises = refs.map(node => {
                    return node.parent.load();
                });
                return Promise.all(promises).then((parents) => {
                    return parents.map(el => {
                        return el.info;
                    });
                });
            });
        }
    }
    elementIsInCategorie(categoryId, elementId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(categoryId, [constants_1.CATEGORY_TO_GROUP_RELATION]).then(children => {
            let itemFound = children.find((child) => {
                return child.childrenIds.find(el => {
                    return el === elementId;
                });
            });
            return itemFound ? true : false;
        });
    }
    ////////////////////////////////////////////////////////////////////
    //                      PRIVATES                                  //
    ////////////////////////////////////////////////////////////////////
    _isCategory(type) {
        return type === this.CATEGORY_TYPE;
    }
    _isContext(type) {
        return type.includes("GroupContext");
    }
    _getRelationRefs(nodeId) {
        let relationRefPromises = [];
        let node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
        let relationList = node.parents[`groupHas${node.getType().get()}`];
        if (relationList) {
            for (let i = 0; i < relationList.length; i++) {
                const element = relationList[i];
                relationRefPromises.push(element.load());
            }
        }
        return Promise.all(relationRefPromises);
    }
}
exports.default = SpinalCategory;
//# sourceMappingURL=SpinalCategory.js.map