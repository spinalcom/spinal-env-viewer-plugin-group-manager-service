import { SpinalNode, SpinalNodeRef } from "spinal-env-viewer-graph-service";
import { ICategoryInfo } from "../interfaces/ICategoryInfo";
export default class SpinalCategory {
    CATEGORY_TYPE: string;
    CONTEXT_TO_CATEGORY_RELATION: string;
    constructor();
    addCategory(contextId: string, categoryName: string, iconName: string): Promise<SpinalNode<any>>;
    getCategories(nodeId: string): Promise<SpinalNodeRef[]>;
    elementIsInCategorie(categoryId: string, elementId: string): Promise<SpinalNodeRef>;
    updateCategory(categoryId: string, newInfo: ICategoryInfo): Promise<SpinalNode<any>>;
    _isCategory(type: string): boolean;
    _isContext(type: string): boolean;
    private _getRelationRefs;
    private _categoryNameExist;
}
