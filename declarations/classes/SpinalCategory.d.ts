export default class SpinalCategory {
    CATEGORY_TYPE: string;
    CONTEXT_TO_CATEGORY_RELATION: string;
    constructor();
    addCategory(contextId: string, categoryName: string, iconName: string): Promise<any>;
    getCategories(nodeId: string): Promise<any>;
    elementIsInCategorie(categoryId: string, elementId: string): Promise<Boolean>;
    _isCategory(type: string): any;
    private _isContext;
    private _getRelationRefs;
    private _categoryNameExist;
}
