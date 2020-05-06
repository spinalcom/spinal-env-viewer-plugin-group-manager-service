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


import { SpinalGraphService, SpinalContext } from "spinal-env-viewer-graph-service";

import { Model } from 'spinal-core-connectorjs_type';


import SpinalGroup from "./SpinalGroup";
import SpinalCategory from "./SpinalCategory";

export default class GroupManagerService {

    // private typesService: Map<string, string> = new Map(
    //     [
    //         [geographicService.constants.ROOM_TYPE, `${geographicService.constants.ROOM_TYPE}GroupContext`],
    //         [BIM_OBJECT_TYPE, `${BIM_OBJECT_TYPE}GroupContext`],
    //         [SpinalBmsEndpoint.nodeTypeName, `${SpinalBmsEndpoint.nodeTypeName}GroupContext`]
    //     ]
    // );

    private spinalGroup: SpinalGroup;
    private spinalCategory: SpinalCategory;

    constructor() {
        this.spinalGroup = new SpinalGroup();
        this.spinalCategory = new SpinalCategory();
    }

    public createGroupContext(contextName: string, childrenType: string): Promise<any> {
        const contextFound = SpinalGraphService.getContext(contextName);

        if (typeof contextFound !== "undefined") return Promise.resolve(contextFound);

        return SpinalGraphService.addContext(contextName, `${childrenType}GroupContext`,
            new Model({
                name: contextName,
                childType: childrenType
            }))

    }

    public getGroupĈontexts(contextType?: string): Promise<any> {
        let graphId = SpinalGraphService.getGraph().getId().get();

        return SpinalGraphService.getChildren(graphId).then(contextsModel => {

            let contexts = contextsModel.map(el => el.get());

            let allGroupContexts = contexts.filter(el => {
                return el.type.includes("GroupContext");
            })

            if (typeof contextType === "undefined") return allGroupContexts;

            return allGroupContexts.filter(el => {
                return el.type.includes(contextType);
            })

        })
    }

    public addCategory(contextId: string, categoryName: string, iconName: string): Promise<any> {
        return this.spinalCategory.addCategory(contextId, categoryName, iconName);
    }

    public getCategories(nodeId: string): Promise<any> {
        return this.spinalCategory.getCategories(nodeId);
    }

    public addGroup(contextId: string, categoryId: string, groupName: string, groupColor: string): Promise<any> {
        return this.spinalGroup.addGroup(contextId, categoryId, groupName, groupColor);
    }

    public getGroups(nodeId: string): Promise<any> {
        return this.spinalGroup.getGroups(nodeId);
    }

    public linkElementToGroup(contextId: string, groupId: string, elementId: string): Promise<any> {
        return this.spinalGroup.linkElementToGroup(contextId, groupId, elementId);
    }

    public elementIsLinkedToGroup(groupId: string, elementId: string): Boolean {
        return this.spinalGroup.elementIsLinkedToGroup(groupId, elementId);
    }

    public elementIsInCategorie(categoryId: string, elementId: string): Promise<Boolean> {
        return this.spinalCategory.elementIsInCategorie(categoryId, elementId);
    }

    public unLinkElementToGroup(groupId: string, elementId: string): Promise<any> {
        return this.spinalGroup.unLinkElementToGroup(groupId, elementId);
    }

    public getElementsLinkedToGroup(groupId: string): Promise<any> {
        return this.spinalGroup.getElementsLinkedToGroup(groupId);
    }

    public isCategory(type: string): boolean {
        return this.spinalCategory._isCategory(type);
    }

    public isGroup(type: string): boolean {
        return this.spinalGroup._isGroup(type);
    }

    public getGroupCategory(groupId: string): Promise<any> {
        return this.spinalGroup.getCategory(groupId);
    }

}