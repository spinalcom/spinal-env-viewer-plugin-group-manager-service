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

import { CATEGORY_TO_GROUP_RELATION, CONTEXT_TO_CATEGORY_RELATION, OLD_RELATIONS_TYPES, OLD_GROUPS_TYPES, OLD_CONTEXTS_TYPES } from "./constants";

import { Model } from 'spinal-core-connectorjs_type';

import geographicService from 'spinal-env-viewer-context-geographic-service';
import { SpinalBmsEndpoint } from "spinal-model-bmsnetwork";

export default class SpinalGroup {

    CATEGORY_TO_GROUP_RELATION: string = CATEGORY_TO_GROUP_RELATION;
    RELATION_BEGIN: string = "groupHas";

    constructor() { }


    public async addGroup(contextId: string, categoryId: string, groupName: string, groupColor: string): Promise<any> {


        const groupFound = await this._groupNameExist(categoryId, groupName);

        if (groupFound) {
            return SpinalGraphService.getRealNode(groupFound.id.get());
        }

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

    public async linkElementToGroup(contextId: string, groupId: string, elementId: string): Promise<any> {
        let contextInfo = SpinalGraphService.getInfo(contextId);
        let elementInfo = SpinalGraphService.getInfo(elementId);

        if (contextInfo && elementInfo) {
            let childrenType = this._getChildrenType(contextInfo.type.get());

            if (childrenType === elementInfo.type.get() || this._isOldGroup(contextInfo.type.get(), elementInfo.type.get()))
                return SpinalGraphService.addChildInContext(groupId, elementId, contextId, `${this.RELATION_BEGIN}${elementInfo.type.get()}`, SPINAL_RELATION_LST_PTR_TYPE)

        }

        throw Error(`${elementInfo.type.get()} cannot be linked to this group.`);
    }

    public elementIsLinkedToGroup(groupId: string, elementId: string): Boolean {
        let childrenIds = SpinalGraphService.getChildrenIds(groupId);
        return childrenIds.indexOf(elementId) !== -1;
    }

    public unLinkElementToGroup(groupId: string, elementId: string): Promise<any> {
        let elementInfo = SpinalGraphService.getInfo(elementId);

        let relationName = `${this.RELATION_BEGIN}${elementInfo.type.get()}`;

        return SpinalGraphService.removeChild(groupId, elementId, relationName, SPINAL_RELATION_LST_PTR_TYPE).then((result) => {
            if (!result) {
                const groupInfo = SpinalGraphService.getInfo(groupId)
                relationName = this._getGroupRelation(groupInfo.type.get());
                return SpinalGraphService.removeChild(groupId, elementId, relationName, SPINAL_RELATION_PTR_LST_TYPE);
            }
        })
    }


    public getElementsLinkedToGroup(groupId: string): Promise<any> {
        let groupInfo = SpinalGraphService.getInfo(groupId);

        let type = this._getChildrenType(groupInfo.type.get());

        let relationNames = [`${this.RELATION_BEGIN}${type}`];

        const tempRel = this._getGroupRelation(groupInfo.type.get());

        if (typeof tempRel !== "undefined") relationNames.push(tempRel);

        return SpinalGraphService.getChildren(groupId, relationNames);
    }


    public getGroups(nodeId: string): Promise<any> {
        let nodeInfo = SpinalGraphService.getInfo(nodeId);

        if (this._isGroup(nodeInfo.type.get())) {
            return Promise.resolve([nodeInfo])
        }

        let relations = [
            CONTEXT_TO_CATEGORY_RELATION,
            CATEGORY_TO_GROUP_RELATION,
            `${this.RELATION_BEGIN}${nodeInfo.type.get()}`,
            OLD_RELATIONS_TYPES.GROUP_TO_ENDPOINT_RELATION,
            OLD_RELATIONS_TYPES.GROUP_TO_EQUIPMENTS_RELATION,
            OLD_RELATIONS_TYPES.GROUP_TO_ROOMS_RELATION
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

    public async getCategory(groupId: string): Promise<any> {
        const parents = await SpinalGraphService.getParents(groupId, this.CATEGORY_TO_GROUP_RELATION);
        if (parents.length > 0) return parents[0];
    }

    public async updateGroup(groupId: string, dataObject: {
        name?: string,
        color?: string
    }): Promise<any> {
        let realNode = SpinalGraphService.getRealNode(groupId);

        for (const key in dataObject) {
            if (dataObject.hasOwnProperty(key)) {
                const value = dataObject[key];
                if (realNode.info[key]) {
                    realNode.info[key].set(value);
                } else {
                    realNode.info.add_attr({
                        [key]: value
                    });
                }
            }
        }

        return realNode;
    }

    public _isGroup(type: string) {

        // let stringEnd = type.substr(type.length - 5);

        // return stringEnd === "Group";

        return /Group$/.test(type);
    }

    ////////////////////////////////////////////////////////////////////
    //                      PRIVATES                                  //
    ////////////////////////////////////////////////////////////////////


    private _getChildrenType(elementType: string): String {



        if (elementType.toLowerCase() === OLD_CONTEXTS_TYPES.ROOMS_GROUP_CONTEXT.toLowerCase() || elementType.toLowerCase() === OLD_GROUPS_TYPES.ROOMS_GROUP.toLowerCase()) {

            return geographicService.constants.ROOM_TYPE;

        } else if (elementType.toLowerCase() === OLD_CONTEXTS_TYPES.EQUIPMENTS_GROUP_CONTEXT.toLowerCase() || elementType.toLowerCase() === OLD_GROUPS_TYPES.EQUIPMENTS_GROUP.toLowerCase()) {

            return geographicService.constants.EQUIPMENT_TYPE

        } else if (elementType.toLowerCase() === OLD_CONTEXTS_TYPES.ENDPOINTS_GROUP_CONTEXT.toLowerCase() || elementType.toLowerCase() === OLD_GROUPS_TYPES.ENDPOINT_GROUP.toLowerCase()) {

            return SpinalBmsEndpoint.nodeTypeName;

        } else {

            if (/GroupContext$/.test(elementType)) return elementType.replace("GroupContext", "");

            else if (/Group$/.test(elementType)) return elementType.replace("Group", "");

            throw new Error(`${elementType} is not a group element type`);

        }

    }

    private _isOldGroup(contextType: string, elementType: string) {

        const isRoomGroup = contextType === OLD_CONTEXTS_TYPES.ROOMS_GROUP_CONTEXT && elementType === geographicService.constants.ROOM_TYPE;
        const isEquipementGroup = contextType === OLD_CONTEXTS_TYPES.EQUIPMENTS_GROUP_CONTEXT && elementType === geographicService.constants.EQUIPMENT_TYPE;
        const isEndpointGroup = contextType === OLD_CONTEXTS_TYPES.ENDPOINTS_GROUP_CONTEXT && elementType === SpinalBmsEndpoint.nodeTypeName;

        console.log(isRoomGroup, isEquipementGroup, isEndpointGroup);

        return isRoomGroup || isEquipementGroup || isEndpointGroup;

    }

    private async _groupNameExist(nodeId: string, groupName: string) {
        const groups = await this.getGroups(nodeId);

        for (const group of groups) {
            const name = group.name.get();
            if (name === groupName) return group;
        }

        return;
    }

    private _getGroupRelation(type: string | String): string {
        let relationName;

        switch (type.toLowerCase()) {
            case OLD_GROUPS_TYPES.ROOMS_GROUP.toLowerCase():
                relationName = OLD_RELATIONS_TYPES.GROUP_TO_ROOMS_RELATION
                break;

            case OLD_GROUPS_TYPES.EQUIPMENTS_GROUP.toLowerCase():
                relationName = OLD_RELATIONS_TYPES.GROUP_TO_EQUIPMENTS_RELATION


                break;
            case OLD_GROUPS_TYPES.EQUIPMENTS_GROUP.toLowerCase():
                relationName = OLD_RELATIONS_TYPES.GROUP_TO_ENDPOINT_RELATION
                break;
        }

        return relationName;

    }

}