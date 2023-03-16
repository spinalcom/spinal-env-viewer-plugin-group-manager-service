import { SpinalNode, SpinalNodeRef } from "spinal-env-viewer-graph-service";
import { IGroupInfo } from "../interfaces/IGroupInfo";
export default class SpinalGroup {
    CATEGORY_TO_GROUP_RELATION: string;
    RELATION_BEGIN: string;
    constructor();
    addGroup(contextId: string, categoryId: string, groupName: string, groupColor: string, groupIcon?: string): Promise<SpinalNode<any>>;
    linkElementToGroup(contextId: string, groupId: string, elementId: string): Promise<SpinalNode<any>>;
    elementIsLinkedToGroup(groupId: string, elementId: string): boolean;
    unLinkElementToGroup(groupId: string, elementId: string): Promise<boolean>;
    getElementsLinkedToGroup(groupId: string): Promise<SpinalNodeRef[]>;
    getGroups(nodeId: string): Promise<SpinalNodeRef[]>;
    getCategory(groupId: string): Promise<SpinalNodeRef>;
    updateGroup(groupId: string, newInfo: IGroupInfo): Promise<SpinalNodeRef>;
    _isGroup(type: string): boolean;
    checkGroupType(groupType: string, childrenType: string): boolean;
    private _getChildrenType;
    private _isOldGroup;
    private _groupNameExist;
    private _getGroupRelation;
}
