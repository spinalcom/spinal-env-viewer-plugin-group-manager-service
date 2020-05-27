export default class SpinalCategory {
    CATEGORY_TYPE: string;
    CONTEXT_TO_CATEGORY_RELATION: string;
    constructor();
    addCategory(contextId: string, categoryName: string, iconName: string): Promise<any>;
    getCategories(nodeId: string): Promise<any>;
    elementIsInCategorie(categoryId: string, elementId: string): Promise<any>;
    updateCategory(categoryId: string, dataObject: {
        name?: string;
        icon?: string;
    }): Promise<any>;
    _isCategory(type: string): any;
    _isContext(type: string): any;
    private _getRelationRefs;
    private _categoryNameExist;
}
