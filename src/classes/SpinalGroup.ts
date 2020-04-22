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


import { SpinalGraphService, SPINAL_RELATION_PTR_LST_TYPE, SPINAL_RELATION_LST_PTR_TYPE } from "spinal-env-viewer-graph-service"


import { CATEGORY_TO_GROUP_RELATION, CONTEXT_TO_CATEGORY_RELATION } from "./constants";

import { Model } from 'spinal-core-connectorjs_type';


export default class SpinalGroup {

    CATEGORY_TO_GROUP_RELATION: string = CATEGORY_TO_GROUP_RELATION;


    constructor() { }


    public addGroup(contextId: string, categoryId: string, groupName: string, groupColor: string): Promise<any> {

        let contextInfo = SpinalGraphService.getInfo(contextId);

        if (contextInfo) {
            let info = {
                name: groupName,
                type: `${this._getChildrenType(contextInfo.type.get())}Group`,
                color: groupColor ? groupColor : "#000000"
            }

            let childId = SpinalGraphService.createNode(info, new Model({
                name: groupName
            }))


            return SpinalGraphService.addChildInContext(categoryId, childId, contextId, this.CATEGORY_TO_GROUP_RELATION, SPINAL_RELATION_PTR_LST_TYPE)

        }


        return Promise.resolve(false);


    }


    public linkElementToGroup(contextId: string, groupId: string, elementId: string): Promise<any> {
        let groupInfo = SpinalGraphService.getInfo(groupId);
        let elementInfo = SpinalGraphService.getInfo(elementId);

        if (groupInfo && elementInfo) {
            let childrenType = this._getChildrenType(groupInfo.type.get());
            if (childrenType === elementInfo.type.get())
                return SpinalGraphService.addChildInContext(groupId, elementId, contextId, `groupHas${elementInfo.type.get()}`, SPINAL_RELATION_LST_PTR_TYPE)

        }

        throw Error(`${elementInfo.type.get()} cannot be linked to this group.`);


    }

    public elementIsLinkedToGroup(groupId: string, elementId: string): Boolean {
        let childrenIds = SpinalGraphService.getChildrenIds(groupId);
        return childrenIds.indexOf(elementId) !== -1;
    }

    public unLinkElementToGroup(groupId: string, elementId: string): Promise<any> {
        let elementInfo = SpinalGraphService.getInfo(elementId);
        let relationName = `groupHas${elementInfo.type.get()}`;

        return SpinalGraphService.removeChild(groupId, elementId, relationName, SPINAL_RELATION_LST_PTR_TYPE);
    }


    public getElementsLinkedToGroup(groupId: string): Promise<any> {
        let groupInfo = SpinalGraphService.getInfo(groupId);

        let type = this._getChildrenType(groupInfo.type.get());
        let relationName = `groupHas${type}`;

        return SpinalGraphService.getChildren(groupId, [relationName]);
    }


    public getGroups(nodeId: string): Promise<any> {
        let nodeInfo = SpinalGraphService.getInfo(nodeId);

        if (this._isGroup(nodeInfo.type.get())) {
            return Promise.resolve([nodeInfo])
        }

        let relations = [
            CONTEXT_TO_CATEGORY_RELATION,
            CATEGORY_TO_GROUP_RELATION,
            `groupHas${nodeInfo.type.get()}`
        ]

        return SpinalGraphService.findNodes(nodeId, relations, (node) => {
            let argType = node.getType().get()
            return this._isGroup(argType);
        }).then(res => {
            return res.map(el => {
                (<any>SpinalGraphService)._addNode(el);
                return el.info;
            })
        })

    }


    ////////////////////////////////////////////////////////////////////
    //                      PRIVATES                                  //
    ////////////////////////////////////////////////////////////////////


    private _getChildrenType(elementType: string): String {
        return elementType.includes("GroupContext") ? elementType.replace("GroupContext", "") : elementType.replace("Group", "");
    }


    private _isGroup(type: string) {
        let stringEnd = type.substr(type.length - 5);

        return stringEnd === "Group";
    }




}