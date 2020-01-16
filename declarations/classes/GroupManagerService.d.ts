export default class GroupManagerService {
    private spinalGroup;
    private spinalCategory;
    constructor();
    createGroupContext(contextName: string, childrenType: string): Promise<boolean>;
    getGroupĈontexts(contextType?: string): Promise<any>;
    addCategory(contextId: string, categoryName: string, iconName: string): Promise<any>;
    getCategories(nodeId: string): Promise<any>;
    addGroup(contextId: string, categoryId: string, groupName: string, groupColor: string): Promise<any>;
    getGroups(nodeId: string): Promise<any>;
    linkElementToGroup(contextId: string, groupId: string, elementId: string): Promise<any>;
    elementIsLinkedToGroup(groupId: string, elementId: string): Boolean;
    elementIsInCategorie(categoryId: string, elementId: string): Promise<Boolean>;
    unLinkElementToGroup(groupId: string, elementId: string): Promise<any>;
    getElementsLinkedToGroup(groupId: string): Promise<any>;
}
