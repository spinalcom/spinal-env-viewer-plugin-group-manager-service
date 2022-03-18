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

///////////////////////////////////////////
//            NEW DATA TYPE              //
///////////////////////////////////////////
export const CATEGORY_TYPE: string = "groupingCategory";

export const CONTEXT_TO_CATEGORY_RELATION: string = "hasCategory";

export const CATEGORY_TO_GROUP_RELATION: string = "hasGroup";

export const GROUP_RELATION_BEGIN = "groupHas";

export const CONTEXTGROUP_TYPE_END = "GroupContext";

export const GROUP_TYPE_END = "Group";

///////////////////////////////////////////
//            EVENT TYPE                 //
///////////////////////////////////////////

export const ELEMENT_LINKED_TO_GROUP_EVENT = "elementLinked"
export const ELEMENT_UNLINKED_TO_GROUP_EVENT = "elementUnLinked"

///////////////////////////////////////////
//            OLD DATA TYPE              //
///////////////////////////////////////////
export const OLD_CONTEXTS_TYPES = Object.freeze({
    ROOMS_GROUP_CONTEXT: "RoomsGroupContext",
    EQUIPMENTS_GROUP_CONTEXT: "EquipmentGroupContext",
    ENDPOINTS_GROUP_CONTEXT: "EndpointGroupContext"
})

export const OLD_GROUPS_TYPES = Object.freeze({
    ROOMS_GROUP: "roomsGroup",
    EQUIPMENTS_GROUP: "equipmentGroup",
    ENDPOINT_GROUP: "endpointGroup"
})

export const OLD_RELATIONS_TYPES = Object.freeze({
    GROUP_TO_ROOMS_RELATION: "groupHasRooms",
    GROUP_TO_EQUIPMENTS_RELATION: "groupHasEquipments",
    GROUP_TO_ENDPOINT_RELATION: "groupHasEndpoints"
})

///////////////////////////////////////////
//            EXPORT ALL                 //
///////////////////////////////////////////

export default {
    CATEGORY_TYPE,
    CONTEXT_TO_CATEGORY_RELATION,
    CATEGORY_TO_GROUP_RELATION,
    OLD_CONTEXTS_TYPES,
    OLD_GROUPS_TYPES,
    OLD_RELATIONS_TYPES,
    ELEMENT_LINKED_TO_GROUP_EVENT,
    ELEMENT_UNLINKED_TO_GROUP_EVENT,
    GROUP_RELATION_BEGIN
}