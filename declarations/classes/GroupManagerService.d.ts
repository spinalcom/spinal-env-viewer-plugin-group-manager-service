import SpinalGroup from "./SpinalGroup";
import SpinalCategory from "./SpinalCategory";
export declare const spinalGroup: SpinalGroup;
export declare const spinalCategory: SpinalCategory;
export default class GroupManagerService {
    constants: {
        CATEGORY_TYPE: string;
        CONTEXT_TO_CATEGORY_RELATION: string;
        CATEGORY_TO_GROUP_RELATION: string;
        OLD_CONTEXTS_TYPES: Readonly<{
            ROOMS_GROUP_CONTEXT: string;
            EQUIPMENTS_GROUP_CONTEXT: string;
            ENDPOINTS_GROUP_CONTEXT: string;
        }>;
        OLD_GROUPS_TYPES: Readonly<{
            ROOMS_GROUP: string;
            EQUIPMENTS_GROUP: string;
            ENDPOINT_GROUP: string;
        }>;
        OLD_RELATIONS_TYPES: Readonly<{
            GROUP_TO_ROOMS_RELATION: string;
            GROUP_TO_EQUIPMENTS_RELATION: string;
            GROUP_TO_ENDPOINT_RELATION: string;
        }>;
        ELEMENT_LINKED_TO_GROUP_EVENT: string;
        ELEMENT_UNLINKED_TO_GROUP_EVENT: string;
    };
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
    isRoomGroupContext(type: string): boolean;
    isEquipmentGroupContext(type: string): boolean;
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
