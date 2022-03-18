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
class SpinalCategory {
    constructor() {
        this.CATEGORY_TYPE = constants_1.CATEGORY_TYPE;
        this.CONTEXT_TO_CATEGORY_RELATION = constants_1.CONTEXT_TO_CATEGORY_RELATION;
    }
    addCategory(contextId, categoryName, iconName) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryFound = yield this._categoryNameExist(contextId, categoryName);
            if (categoryFound) {
                return spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(categoryFound.id.get());
            }
            let info = {
                name: categoryName,
                type: this.CATEGORY_TYPE,
                icon: iconName
            };
            let childId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(info, new spinal_core_connectorjs_type_1.Model({
                name: categoryName
            }));
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(contextId, childId, contextId, this.CONTEXT_TO_CATEGORY_RELATION, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
        });
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
                        return spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(el.getId().get());
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
            return itemFound;
        });
    }
    updateCategory(categoryId, newInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            let realNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(categoryId);
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
            return realNode;
        });
    }
    ////////////////////////////////////////////////////////////////////
    //                      PRIVATES                                  //
    ////////////////////////////////////////////////////////////////////
    _isCategory(type) {
        return type === this.CATEGORY_TYPE;
    }
    _isContext(type) {
        const values = Object.values(constants_1.OLD_CONTEXTS_TYPES);
        if (values.indexOf(type) !== -1)
            return true;
        return /GroupContext$/.test(type);
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
    _categoryNameExist(nodeId, categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this.getCategories(nodeId);
            for (const category of categories) {
                const name = category.name.get();
                if (name === categoryName)
                    return category;
            }
        });
    }
}
exports.default = SpinalCategory;
//# sourceMappingURL=SpinalCategory.js.map