export default class SpinalGroup {
    CATEGORY_TO_GROUP_RELATION: string;
    constructor();
    addGroup(contextId: string, categoryId: string, groupName: string, groupColor: string): Promise<any>;
    linkElementToGroup(contextId: string, groupId: string, elementId: string): Promise<any>;
    elementIsLinkedToGroup(groupId: string, elementId: string): Boolean;
    unLinkElementToGroup(groupId: string, elementId: string): Promise<any>;
    getElementsLinkedToGroup(groupId: string): Promise<any>;
    getGroups(nodeId: string): Promise<any>;
    getCategory(groupId: string): Promise<any>;
    private _getChildrenType;
    _isGroup(type: string): boolean;
}
