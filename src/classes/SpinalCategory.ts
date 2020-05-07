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


import { SpinalGraphService, SPINAL_RELATION_PTR_LST_TYPE } from "spinal-env-viewer-graph-service";

import { CATEGORY_TYPE, CONTEXT_TO_CATEGORY_RELATION, CATEGORY_TO_GROUP_RELATION } from "./constants";

import { Model } from 'spinal-core-connectorjs_type';

export default class SpinalCategory {

    CATEGORY_TYPE: string = CATEGORY_TYPE;
    CONTEXT_TO_CATEGORY_RELATION: string = CONTEXT_TO_CATEGORY_RELATION;

    constructor() { }


    public async addCategory(contextId: string, categoryName: string, iconName: string): Promise<any> {

        const categoryFound = await this._categoryNameExist(contextId, categoryName);

        if (categoryFound) {
            return SpinalGraphService.getRealNode(categoryFound.id.get());
        }

        let info = {
            name: categoryName,
            type: this.CATEGORY_TYPE,
            icon: iconName
        }

        let childId = SpinalGraphService.createNode(info, new Model({
            name: categoryName
        }))

        return SpinalGraphService.addChildInContext(contextId, childId, contextId, this.CONTEXT_TO_CATEGORY_RELATION, SPINAL_RELATION_PTR_LST_TYPE)

    }

    public getCategories(nodeId: string): Promise<any> {

        let nodeInfo = SpinalGraphService.getInfo(nodeId);

        if (this._isCategory(nodeInfo.type.get())) {

            return Promise.resolve([nodeInfo]);

        } else if (this._isContext(nodeInfo.type.get())) {

            return SpinalGraphService.getChildren(nodeId, [this.CONTEXT_TO_CATEGORY_RELATION]);

        } else {

            return this._getRelationRefs(nodeId).then(refs => {
                let promises = refs.map(node => {
                    return node.parent.load();
                })


                return Promise.all(promises).then((parents: any) => {
                    return parents.map(el => {
                        return el.info;
                    });
                });

            })

        }

    }

    public elementIsInCategorie(categoryId: string, elementId: string): Promise<Boolean> {
        return SpinalGraphService.getChildren(categoryId, [CATEGORY_TO_GROUP_RELATION]).then(children => {
            let itemFound = children.find((child: any) => {
                return child.childrenIds.find(el => {
                    return el === elementId
                })
            })

            return itemFound ? true : false;
        })
    }


    ////////////////////////////////////////////////////////////////////
    //                      PRIVATES                                  //
    ////////////////////////////////////////////////////////////////////

    public _isCategory(type: string): any {
        return type === this.CATEGORY_TYPE;
    }

    private _isContext(type: string): any {
        return type.includes("GroupContext");
    }

    private _getRelationRefs(nodeId: string): Promise<any> {
        let relationRefPromises = [];

        let node = SpinalGraphService.getRealNode(nodeId);

        let relationList = node.parents[`groupHas${node.getType().get()}`];

        if (relationList) {
            for (let i = 0; i < relationList.length; i++) {
                const element = relationList[i];
                relationRefPromises.push(element.load());
            }

        }

        return Promise.all(relationRefPromises)
    }

    private async _categoryNameExist(nodeId: string, categoryName: string) {
        const categories = await this.getCategories(nodeId);

        for (const category of categories) {
            const name = category.name.get();
            if (name === categoryName) return category;
        }

        return;
    }

}