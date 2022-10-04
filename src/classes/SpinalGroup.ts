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


import { SpinalGraphService, SPINAL_RELATION_PTR_LST_TYPE, SPINAL_RELATION_LST_PTR_TYPE, SpinalNode, SpinalNodeRef } from "spinal-env-viewer-graph-service"

import { CATEGORY_TO_GROUP_RELATION, CONTEXT_TO_CATEGORY_RELATION, OLD_RELATIONS_TYPES, OLD_GROUPS_TYPES, OLD_CONTEXTS_TYPES, GROUP_RELATION_BEGIN } from "./constants";

import { Model } from 'spinal-core-connectorjs_type';

import geographicService from 'spinal-env-viewer-context-geographic-service';
import { SpinalBmsEndpoint } from "spinal-model-bmsnetwork";
import { IGroupInfo } from "../interfaces/IGroupInfo";

export default class SpinalGroup {

    public CATEGORY_TO_GROUP_RELATION: string = CATEGORY_TO_GROUP_RELATION;
    public RELATION_BEGIN: string = GROUP_RELATION_BEGIN;

    constructor() { }


    public async addGroup(contextId: string, categoryId: string, groupName: string, groupColor: string): Promise<SpinalNode<any>> {


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


        // return Promise.resolve(false);
    }

    public async linkElementToGroup(contextId: string, groupId: string, elementId: string): Promise<SpinalNode<any>> {
        let contextInfo = SpinalGraphService.getInfo(contextId);
        let elementInfo = SpinalGraphService.getInfo(elementId);

        if (contextInfo && elementInfo) {
            let childrenType = this._getChildrenType(contextInfo.type.get());

            if (childrenType === elementInfo.type.get() || this._isOldGroup(contextInfo.type.get(), elementInfo.type.get()))
                return SpinalGraphService.addChildInContext(groupId, elementId, contextId, `${this.RELATION_BEGIN}${elementInfo.type.get()}`, SPINAL_RELATION_PTR_LST_TYPE)

        }

        throw Error(`${elementInfo.type.get()} cannot be linked to this group.`);
    }

    public elementIsLinkedToGroup(groupId: string, elementId: string): boolean {
        let childrenIds = SpinalGraphService.getChildrenIds(groupId);
        return childrenIds.indexOf(elementId) !== -1;
    }

    public async unLinkElementToGroup(groupId: string, elementId: string): Promise<boolean> {
        let elementInfo = SpinalGraphService.getInfo(elementId);

        let relationName = `${this.RELATION_BEGIN}${elementInfo.type.get()}`;
        let result;

        try {
            result = await SpinalGraphService.removeChild(groupId, elementId, relationName, SPINAL_RELATION_PTR_LST_TYPE)
        } catch (error) {
            result = await SpinalGraphService.removeChild(groupId, elementId, relationName, SPINAL_RELATION_LST_PTR_TYPE)
        }

        if (!result) {
            const groupInfo = SpinalGraphService.getInfo(groupId)
            relationName = this._getGroupRelation(groupInfo.type.get());
            return SpinalGraphService.removeChild(groupId, elementId, relationName, SPINAL_RELATION_PTR_LST_TYPE);
        }

    }


    public getElementsLinkedToGroup(groupId: string): Promise<SpinalNodeRef[]> {
        let groupInfo = SpinalGraphService.getInfo(groupId);

        let type = this._getChildrenType(groupInfo.type.get());

        let relationNames = [`${this.RELATION_BEGIN}${type}`];

        const tempRel = this._getGroupRelation(groupInfo.type.get());

        if (typeof tempRel !== "undefined") relationNames.push(tempRel);

        return SpinalGraphService.getChildren(groupId, relationNames);
    }


    public getGroups(nodeId: string): Promise<SpinalNodeRef[]> {
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
                return SpinalGraphService.getInfo(el.getId().get());
            })
        })

    }

    public async getCategory(groupId: string): Promise<SpinalNodeRef> {
        const parents = await SpinalGraphService.getParents(groupId, this.CATEGORY_TO_GROUP_RELATION);
        if (parents.length > 0) return parents[0];
    }

    public async updateGroup(groupId: string, newInfo: IGroupInfo): Promise<SpinalNodeRef> {
        let realNode = SpinalGraphService.getRealNode(groupId);

        for (const key in newInfo) {
            if (newInfo.hasOwnProperty(key)) {
                const value = newInfo[key];
                if (realNode.info[key]) {
                    realNode.info[key].set(value);
                } else {
                    realNode.info.add_attr({
                        [key]: value
                    });
                }
            }
        }

        return SpinalGraphService.getInfo(realNode.getId().get());
    }

    public _isGroup(type: string): boolean {

        // let stringEnd = type.substr(type.length - 5);

        // return stringEnd === "Group";

        return /Group$/.test(type);
    }

    public checkGroupType(groupType: string, childrenType: string): boolean {
        return groupType === `${childrenType}Group`;
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

    private _isOldGroup(contextType: string, elementType: string): boolean {

        const isRoomGroup = contextType === OLD_CONTEXTS_TYPES.ROOMS_GROUP_CONTEXT && elementType === geographicService.constants.ROOM_TYPE;
        const isEquipementGroup = contextType === OLD_CONTEXTS_TYPES.EQUIPMENTS_GROUP_CONTEXT && elementType === geographicService.constants.EQUIPMENT_TYPE;
        const isEndpointGroup = contextType === OLD_CONTEXTS_TYPES.ENDPOINTS_GROUP_CONTEXT && elementType === SpinalBmsEndpoint.nodeTypeName;

        console.log(isRoomGroup, isEquipementGroup, isEndpointGroup);

        return isRoomGroup || isEquipementGroup || isEndpointGroup;

    }

    private async _groupNameExist(nodeId: string, groupName: string): Promise<SpinalNodeRef> {
        const groups = await this.getGroups(nodeId);

        for (const group of groups) {
            const name = group.name.get();
            if (name === groupName) return group;
        }

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