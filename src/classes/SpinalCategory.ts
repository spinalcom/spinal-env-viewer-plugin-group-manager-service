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

import {
  SpinalGraphService,
  SpinalNode,
  SpinalNodeRef,
  SPINAL_RELATION_PTR_LST_TYPE,
} from 'spinal-env-viewer-graph-service';

import {
  CATEGORY_TYPE,
  CONTEXT_TO_CATEGORY_RELATION,
  CATEGORY_TO_GROUP_RELATION,
  OLD_CONTEXTS_TYPES,
} from './constants';

import { Model } from 'spinal-core-connectorjs_type';
import { ICategoryInfo } from '../interfaces/ICategoryInfo';
import { AnySpinalRelation } from 'spinal-model-graph';
import type SpinalGroup from './SpinalGroup';

export default class SpinalCategory {
  CATEGORY_TYPE: string = CATEGORY_TYPE;
  CONTEXT_TO_CATEGORY_RELATION: string = CONTEXT_TO_CATEGORY_RELATION;

  constructor() {}

  public async addCategory(
    contextId: string,
    categoryName: string,
    iconName: string
  ): Promise<SpinalNode<any>> {
    const categoryFound = await this._categoryNameExist(
      contextId,
      categoryName
    );

    if (categoryFound) {
      return SpinalGraphService.getRealNode(categoryFound.id.get());
    }

    let info = {
      name: categoryName,
      type: this.CATEGORY_TYPE,
      icon: iconName,
    };

    let childId = SpinalGraphService.createNode(
      info,
      new Model({
        name: categoryName,
      })
    );

    return SpinalGraphService.addChildInContext(
      contextId,
      childId,
      contextId,
      this.CONTEXT_TO_CATEGORY_RELATION,
      SPINAL_RELATION_PTR_LST_TYPE
    );
  }

  public async getCategories(nodeId: string): Promise<SpinalNodeRef[]> {
    let nodeInfo = SpinalGraphService.getInfo(nodeId);

    if (this._isCategory(nodeInfo.type.get())) {
      return Promise.resolve([nodeInfo]);
    } else if (this._isContext(nodeInfo.type.get())) {
      return SpinalGraphService.getChildren(nodeId, [
        this.CONTEXT_TO_CATEGORY_RELATION,
      ]);
    } else {
      const refs = await this._getRelationRefs(nodeId);
      let promises = refs.map((node) => {
        return node.parent.load();
      });
      const parents = await Promise.all(promises);
      return parents.map((el) => {
        return SpinalGraphService.getInfo(el.getId().get());
      });
    }
  }

  public async elementIsInCategorie(
    categoryId: string,
    elementId: string
  ): Promise<SpinalNodeRef | undefined> {
    const realNode = SpinalGraphService.getRealNode(categoryId);
    const children = await realNode.getChildren([CATEGORY_TO_GROUP_RELATION]);
    let itemFound = children.find((child: SpinalNode) => {
      const childrenIds = child.getChildrenIds();
      return childrenIds.find((el) => {
        return el === elementId;
      });
    });
    if (itemFound) {
      SpinalGraphService._addNode(itemFound);
      return SpinalGraphService.getInfo(itemFound.getId().get());
    }
    return undefined;
  }

  public async updateCategory(
    categoryId: string,
    newInfo: ICategoryInfo
  ): Promise<SpinalNode<any>> {
    let realNode = SpinalGraphService.getRealNode(categoryId);

    for (const key in newInfo) {
      if (newInfo.hasOwnProperty(key)) {
        const value = newInfo[key as keyof ICategoryInfo];
        if (realNode.info[key]) {
          realNode.info[key].set(value);
        } else {
          realNode.info.add_attr({
            [key]: value,
          });
        }
      }
    }

    return realNode;
  }

  public async deleteCategoryFromGraph(
    categoryId: string,
    spinalGroup: SpinalGroup
  ): Promise<void> {
    const groups = await spinalGroup.getGroups(categoryId);
    for (const group of groups) {
      await spinalGroup.deleteGroupFromGraph(group.id.get());
    }
    await SpinalGraphService.removeFromGraph(categoryId);
  }

  ////////////////////////////////////////////////////////////////////
  //                      PRIVATES                                  //
  ////////////////////////////////////////////////////////////////////

  public _isCategory(type: string): boolean {
    return type === this.CATEGORY_TYPE;
  }

  public _isContext(type: string): boolean {
    const values: string[] = Object.values(OLD_CONTEXTS_TYPES);
    if (values.indexOf(type) !== -1) return true;

    return /GroupContext$/.test(type);
  }

  private _getRelationRefs(nodeId: string): Promise<AnySpinalRelation[]> {
    let relationRefPromises = [];

    let node = SpinalGraphService.getRealNode(nodeId);

    let relationList = node.parents[`groupHas${node.getType().get()}`];

    if (relationList) {
      for (let i = 0; i < relationList.length; i++) {
        const element = relationList[i];
        relationRefPromises.push(element.load());
      }
    }

    return Promise.all(relationRefPromises);
  }

  private async _categoryNameExist(
    nodeId: string,
    categoryName: string
  ): Promise<SpinalNodeRef | undefined> {
    const categories = await this.getCategories(nodeId);

    for (const category of categories) {
      const name = category.name.get();
      if (name === categoryName) return category;
    }
    return undefined;
  }
}
