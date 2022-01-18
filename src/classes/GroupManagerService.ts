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


import { SpinalGraphService } from "spinal-env-viewer-graph-service";

import { Model } from 'spinal-core-connectorjs_type';

import geographicService from 'spinal-env-viewer-context-geographic-service'
import { SpinalBmsEndpoint } from "spinal-model-bmsnetwork";

import SpinalGroup from "./SpinalGroup";
import SpinalCategory from "./SpinalCategory";

import constants, { OLD_GROUPS_TYPES, OLD_CONTEXTS_TYPES, ELEMENT_LINKED_TO_GROUP_EVENT, ELEMENT_UNLINKED_TO_GROUP_EVENT } from "./constants";

import { spinalEventEmitter } from "spinal-env-viewer-plugin-event-emitter";


export const spinalGroup: SpinalGroup = new SpinalGroup();;
export const spinalCategory: SpinalCategory = new SpinalCategory();;

export default class GroupManagerService {

    // private typesService: Map<string, string> = new Map(
    //     [
    //         [geographicService.constants.ROOM_TYPE, `${geographicService.constants.ROOM_TYPE}GroupContext`],
    //         [BIM_OBJECT_TYPE, `${BIM_OBJECT_TYPE}GroupContext`],
    //         [SpinalBmsEndpoint.nodeTypeName, `${SpinalBmsEndpoint.nodeTypeName}GroupContext`]
    //     ]
    // );


    public constants = constants;

    constructor() { }

    public createGroupContext(contextName: string, childrenType: string): Promise<any> {
        const contextFound = SpinalGraphService.getContext(contextName);

        if (typeof contextFound !== "undefined") return Promise.resolve(contextFound);

        return SpinalGraphService.addContext(contextName, `${childrenType}GroupContext`,
            new Model({
                name: contextName,
                childType: childrenType
            }))

    }

    public getGroupContexts(childType?: string): Promise<any> {

        let graphId = SpinalGraphService.getGraph().getId().get();

        return SpinalGraphService.getChildren(graphId).then(contextsModel => {

            let contexts = contextsModel.map(el => el.get());

            let allGroupContexts = contexts.filter(el => {
                return el.type.includes("GroupContext");
            })

            if (typeof childType === "undefined") return allGroupContexts;

            const oldType = this._getOldTypes(childType);

            return allGroupContexts.filter(el => {
                return el.type.includes(childType) || el.type === oldType;
            })

        })
    }

    public addCategory(contextId: string, categoryName: string, iconName: string): Promise<any> {
        return spinalCategory.addCategory(contextId, categoryName, iconName);
    }

    public getCategories(nodeId: string): Promise<any> {
        return spinalCategory.getCategories(nodeId);
    }

    public addGroup(contextId: string, categoryId: string, groupName: string, groupColor: string): Promise<any> {
        return spinalGroup.addGroup(contextId, categoryId, groupName, groupColor);
    }

    public getGroups(nodeId: string): Promise<any> {
        return spinalGroup.getGroups(nodeId);
    }

    public async linkElementToGroup(contextId: string, groupId: string, elementId: string): Promise<any> {

        const category = await this.getGroupCategory(groupId);
        const group = await this.elementIsInCategorie(category.id.get(), elementId);
        const result = { old_group: undefined, newGroup: groupId };

        if (typeof group !== "undefined") {
            this.unLinkElementToGroup(group.id.get(), elementId);
            result.old_group = group.id.get();
        }

        await spinalGroup.linkElementToGroup(contextId, groupId, elementId);

        spinalEventEmitter.emit(ELEMENT_LINKED_TO_GROUP_EVENT, { groupId, elementId });
        return result;
    }

    public elementIsLinkedToGroup(groupId: string, elementId: string): Boolean {
        return spinalGroup.elementIsLinkedToGroup(groupId, elementId);
    }

    public elementIsInCategorie(categoryId: string, elementId: string): Promise<any> {
        return spinalCategory.elementIsInCategorie(categoryId, elementId);
    }

    public unLinkElementToGroup(groupId: string, elementId: string): Promise<any> {
        return spinalGroup.unLinkElementToGroup(groupId, elementId).then((result) => {
            spinalEventEmitter.emit(ELEMENT_UNLINKED_TO_GROUP_EVENT, { groupId, elementId });
            return result;
        })
    }

    public getElementsLinkedToGroup(groupId: string): Promise<any> {
        return spinalGroup.getElementsLinkedToGroup(groupId);
    }

    public getGroupCategory(groupId: string): Promise<any> {
        return spinalGroup.getCategory(groupId);
    }

    public isContext(type: string): boolean {
        return spinalCategory._isContext(type);
    }

    public isRoomGroupContext(type: string): boolean {
        return type == `${geographicService.constants.ROOM_TYPE}GroupContext` || OLD_CONTEXTS_TYPES.ROOMS_GROUP_CONTEXT == type;
    }

    public isEquipmentGroupContext(type: string): boolean {
        return type == `${geographicService.constants.EQUIPMENT_TYPE}GroupContext` || OLD_CONTEXTS_TYPES.EQUIPMENTS_GROUP_CONTEXT == type;
    }

    public isCategory(type: string): boolean {
        return spinalCategory._isCategory(type);
    }

    public isGroup(type: string): boolean {
        return spinalGroup._isGroup(type);
    }

    public isRoomsGroup(type): boolean {
        return type == `${geographicService.constants.ROOM_TYPE}Group` || OLD_CONTEXTS_TYPES.ROOMS_GROUP_CONTEXT.replace("Context", "") == type || type === OLD_GROUPS_TYPES.ROOMS_GROUP;
    }

    public isEquipementGroup(type): boolean {
        return type == `${geographicService.constants.EQUIPMENT_TYPE}Group` || OLD_CONTEXTS_TYPES.EQUIPMENTS_GROUP_CONTEXT.replace("Context", "") == type || type === OLD_GROUPS_TYPES.EQUIPMENTS_GROUP;
    }

    public isEndpointGroup(type): boolean {
        return;
    }

    public updateCategory(categoryId: string, dataObject: {
        name?: string,
        icon?: string
    }): Promise<any> {
        return spinalCategory.updateCategory(categoryId, dataObject);
    }

    public updateGroup(categoryId: string, dataObject: {
        name?: string,
        color?: string
    }): Promise<any> {
        return spinalGroup.updateGroup(categoryId, dataObject);
    }


    ////////////////////////////////////////////////////////////////////
    //                      PRIVATES                                  //
    ////////////////////////////////////////////////////////////////////

    private _getOldTypes(type) {
        switch (type) {
            case geographicService.constants.ROOM_TYPE:
                return this.constants.OLD_CONTEXTS_TYPES.ROOMS_GROUP_CONTEXT;

            case geographicService.constants.EQUIPMENT_TYPE:
                return this.constants.OLD_CONTEXTS_TYPES.EQUIPMENTS_GROUP_CONTEXT;

            case SpinalBmsEndpoint.nodeTypeName:
                return this.constants.OLD_CONTEXTS_TYPES.ENDPOINTS_GROUP_CONTEXT;
        }
    }


}