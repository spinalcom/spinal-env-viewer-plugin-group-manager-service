export default class GroupManagerService {
    private spinalGroup;
    private spinalCategory;
    constants: any;
    constructor();
    createGroupContext(contextName: string, childrenType: string): Promise<any>;
    getGroupContexts(childType?: string): Promise<any>;
    addCategory(contextId: string, categoryName: string, iconName: string): Promise<any>;
    getCategories(nodeId: string): Promise<any>;
    addGroup(contextId: string, categoryId: string, groupName: string, groupColor: string): Promise<any>;
    getGroups(nodeId: string): Promise<any>;
    linkElementToGroup(contextId: string, groupId: string, elementId: string): Promise<any>;
    elementIsLinkedToGroup(groupId: string, elementId: string): Boolean;
    elementIsInCategorie(categoryId: string, elementId: string): Promise<any>;
    unLinkElementToGroup(groupId: string, elementId: string): Promise<any>;
    getElementsLinkedToGroup(groupId: string): Promise<any>;
    getGroupCategory(groupId: string): Promise<any>;
    isContext(type: string): boolean;
    isCategory(type: string): boolean;
    isGroup(type: string): boolean;
    isRoomsGroup(type: any): boolean;
    isEquipementGroup(type: any): boolean;
    isEndpointGroup(type: any): boolean;
    updateCategory(categoryId: string, dataObject: {
        name?: string;
        icon?: string;
    }): Promise<any>;
    updateGroup(categoryId: string, dataObject: {
        name?: string;
        color?: string;
    }): Promise<any>;
    private _getOldTypes;
}
