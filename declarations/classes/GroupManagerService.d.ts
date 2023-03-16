import { SpinalGraph, SpinalContext, SpinalNode, SpinalNodeRef } from "spinal-env-viewer-graph-service";
import SpinalGroup from "./SpinalGroup";
import SpinalCategory from "./SpinalCategory";
import { INodeRefObj } from "../interfaces/INodeRefObj";
import { IGroupInfo } from "../interfaces/IGroupInfo";
import { ICategoryInfo } from "../interfaces/ICategoryInfo";
export declare const spinalGroup: SpinalGroup;
export declare const spinalCategory: SpinalCategory;
export default class GroupManagerService {
    constants: {
        CATEGORY_TYPE: string;
        CONTEXT_TO_CATEGORY_RELATION: string;
        CATEGORY_TO_GROUP_RELATION: string;
        OLD_CONTEXTS_TYPES: Readonly<{
            ROOMS_GROUP_CONTEXT: "RoomsGroupContext";
            EQUIPMENTS_GROUP_CONTEXT: "EquipmentGroupContext";
            ENDPOINTS_GROUP_CONTEXT: "EndpointGroupContext";
        }>;
        OLD_GROUPS_TYPES: Readonly<{
            ROOMS_GROUP: "roomsGroup";
            EQUIPMENTS_GROUP: "equipmentGroup";
            ENDPOINT_GROUP: "endpointGroup";
        }>;
        OLD_RELATIONS_TYPES: Readonly<{
            GROUP_TO_ROOMS_RELATION: "groupHasRooms";
            GROUP_TO_EQUIPMENTS_RELATION: "groupHasEquipments";
            GROUP_TO_ENDPOINT_RELATION: "groupHasEndpoints";
        }>;
        ELEMENT_LINKED_TO_GROUP_EVENT: string;
        ELEMENT_UNLINKED_TO_GROUP_EVENT: string;
        GROUP_RELATION_BEGIN: string;
    };
    constructor();
    createGroupContext(contextName: string, childrenType: string, graph?: SpinalGraph<any>): Promise<SpinalContext<any>>;
    getGroupContexts(childType?: string, graph?: SpinalGraph<any>): Promise<INodeRefObj[]>;
    addCategory(contextId: string, categoryName: string, iconName: string): Promise<SpinalNode<any>>;
    getCategories(nodeId: string): Promise<SpinalNodeRef[]>;
    addGroup(contextId: string, categoryId: string, groupName: string, groupColor: string, groupIcon?: string): Promise<SpinalNode<any>>;
    getGroups(nodeId: string): Promise<SpinalNodeRef[]>;
    linkElementToGroup(contextId: string, groupId: string, elementId: string): Promise<{
        old_group: string;
        newGroup: string;
    }>;
    elementIsLinkedToGroup(groupId: string, elementId: string): boolean;
    elementIsInCategorie(categoryId: string, elementId: string): Promise<SpinalNodeRef>;
    unLinkElementToGroup(groupId: string, elementId: string): Promise<boolean>;
    getElementsLinkedToGroup(groupId: string): Promise<SpinalNodeRef[]>;
    getGroupCategory(groupId: string): Promise<SpinalNodeRef>;
    isContext(type: string): boolean;
    isRoomGroupContext(type: string): boolean;
    isEquipmentGroupContext(type: string): boolean;
    isCategory(type: string): boolean;
    isGroup(type: string): boolean;
    isRoomsGroup(type: string): boolean;
    isEquipementGroup(type: string): boolean;
    checkGroupType(groupType: string, childrenType: string): boolean;
    checkContextType(contextType: string, childrenType: string): boolean;
    updateCategory(categoryId: string, newInfo: ICategoryInfo): Promise<SpinalNode<any>>;
    updateGroup(categoryId: string, newInfo: IGroupInfo): Promise<SpinalNodeRef>;
    getChildrenType(type: string): string;
    private _getOldTypes;
    private _getContexts;
}
