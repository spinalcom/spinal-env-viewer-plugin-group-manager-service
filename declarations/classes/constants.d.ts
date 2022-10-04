export declare const CATEGORY_TYPE: string;
export declare const CONTEXT_TO_CATEGORY_RELATION: string;
export declare const CATEGORY_TO_GROUP_RELATION: string;
export declare const GROUP_RELATION_BEGIN = "groupHas";
export declare const CONTEXTGROUP_TYPE_END = "GroupContext";
export declare const GROUP_TYPE_END = "Group";
export declare const ELEMENT_LINKED_TO_GROUP_EVENT = "elementLinked";
export declare const ELEMENT_UNLINKED_TO_GROUP_EVENT = "elementUnLinked";
export declare const OLD_CONTEXTS_TYPES: Readonly<{
    ROOMS_GROUP_CONTEXT: "RoomsGroupContext";
    EQUIPMENTS_GROUP_CONTEXT: "EquipmentGroupContext";
    ENDPOINTS_GROUP_CONTEXT: "EndpointGroupContext";
}>;
export declare const OLD_GROUPS_TYPES: Readonly<{
    ROOMS_GROUP: "roomsGroup";
    EQUIPMENTS_GROUP: "equipmentGroup";
    ENDPOINT_GROUP: "endpointGroup";
}>;
export declare const OLD_RELATIONS_TYPES: Readonly<{
    GROUP_TO_ROOMS_RELATION: "groupHasRooms";
    GROUP_TO_EQUIPMENTS_RELATION: "groupHasEquipments";
    GROUP_TO_ENDPOINT_RELATION: "groupHasEndpoints";
}>;
declare const _default: {
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
export default _default;
