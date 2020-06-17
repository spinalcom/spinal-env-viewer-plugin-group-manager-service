export default class SpinalGroup {
    CATEGORY_TO_GROUP_RELATION: string;
    RELATION_BEGIN: string;
    constructor();
    addGroup(contextId: string, categoryId: string, groupName: string, groupColor: string): Promise<any>;
    linkElementToGroup(contextId: string, groupId: string, elementId: string): Promise<any>;
    elementIsLinkedToGroup(groupId: string, elementId: string): Boolean;
    unLinkElementToGroup(groupId: string, elementId: string): Promise<any>;
    getElementsLinkedToGroup(groupId: string): Promise<any>;
    getGroups(nodeId: string): Promise<any>;
    getCategory(groupId: string): Promise<any>;
    updateGroup(groupId: string, dataObject: {
        name?: string;
        color?: string;
    }): Promise<any>;
    _isGroup(type: string): boolean;
    private _getChildrenType;
    private _isOldGroup;
    private _groupNameExist;
    private _getGroupRelation;
}
