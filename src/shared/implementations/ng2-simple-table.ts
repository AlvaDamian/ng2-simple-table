import { EventEmitter } from '@angular/core';
import { Column, ActionsColumn, ActionsColumnForEachRow, Sort, Ng2ST } from '../interfaces';

export class Ng2STAutonomous implements Ng2ST<Sort> {

  private DEFAULT_ACTIONS_TARGET= 'Ng2STActionsColumn';

  private actions: ActionsColumn;
  private actionsTarget: string;
  private sortStrategies: Map<string, Sort>;
  private page: number;
  private perPage: number;

  private onDataChange: EventEmitter<Array<any>>;

  public constructor(
    private data: Array<any>,
    private columns: Array<Column>
  ) {

    this.actions = null;
    this.sortStrategies = new Map<string, Sort>();
    this.onDataChange = new EventEmitter<Array<any>>();
  }

  private resolveActionsColumnTarget(columns: Array<Column>, desiredResult: string): string {

    let exists = columns.find(value => value.target === desiredResult) != null;

    return !exists ?
            desiredResult :
            this.resolveActionsColumnTarget(columns, desiredResult + desiredResult);
  }

  private addActionsToHeader(header: Array<any>): void {

    if (!this.actions) {
      return;
    }

    this.actionsTarget = this.resolveActionsColumnTarget(this.columns, this.DEFAULT_ACTIONS_TARGET);
    let toAdd = {title: this.actions.title, target: this.actionsTarget };

    if (this.actions.displayOnLeft) {
      header.unshift(toAdd);
    } else {
      header.push(toAdd);
    }
  }

  private getActions(obj: any): any {

    if (!this.actions) {
      return null;
    }

    let actions = '';

    if (this.actions.forEachRow) {

      for (let call of this.actions.forEachRow) {

        actions += call.callBack(obj);
      }
    }

    return actions;
  }

  public replaceData(data: Array<any>): void {

    this.data = data;
  }

  public getData(): Promise<Array<any>> {

    if (!this.page || !this.perPage) {
      return new Promise((resolve) => resolve(this.data));
    }

    let ret: Array<any> = new Array<any>();

    if (this.data.length - (this.page - 1) * this.perPage <= 0) {
      return new Promise((resolve) => resolve(ret));
    }

    let index: number;
    for (let i = 0; i < this.perPage; i++) {

      index = this.perPage * (this.page - 1) + i;

      if (index >= this.data.length) {
        break;
      }

      ret.push(this.data[index]);
    }

    return new Promise((resolve) => resolve(ret));;
  }

  public getColumns(): Array<Column> {

    return this.columns;
  }

  public getActionsColumn(): ActionsColumn {
    return this.actions;
  }

  public getValue(obj: any, column: Column): any {

    let target = column.target;

    if (target === this.actionsTarget) {
      return this.getActions(obj);
    }

    if (obj.hasOwnProperty(target)) {

      if (column.customValue) {
        return column.customValue(obj[target], obj);
      }

      return obj[target];
    }

    return null;
  }

  public getSortStrategies(): Map<string, Sort> {
    return this.sortStrategies;
  }

  public getSortStrategy(target: string): Sort {

    if (this.hasSortStrategy(target)) {
      return this.sortStrategies.get(target);
    }

    return null;
  }

  public hasSortStrategy(target: string): boolean {
    return this.sortStrategies.has(target);
  }

  public setActionsColumn(column: ActionsColumn): void {

    this.actions = column;

    if (this.actions && !this.actions.forEachRow) {
      this.actions.forEachRow = new Array<ActionsColumnForEachRow>();
    }

    this.addActionsToHeader(this.columns);
  }

  public addSortStrategy(target: string, strategy: Sort, replaceIfExists = true): boolean {

    let exists = this.sortStrategies.has(target);

    if (exists && !replaceIfExists) {
      return false;
    }

    this.sortStrategies.set(target, strategy);
    return true;
  }

  public sort(target: string, asc = true): void {

    if (!this.hasSortStrategy(target)) {
      return;
    }

    let sortStrategy = this.getSortStrategy(target);

    let toUse = asc ? sortStrategy.asc : sortStrategy.desc;
    this.data = this.data.sort((arg0, arg1) => toUse(arg0[target], arg1[target]));
  }

  public addPagination(initialPage: number, perPage: number): void {

    this.page = initialPage;
    this.perPage = perPage;
  }

  public getNumberOfPages(): number {

    let calc = this.data.length / this.perPage;
    let fixedValue = Math.floor(calc);

    return fixedValue === calc ? fixedValue : fixedValue + 1;
  }

  public getPage(): number {
    return this.page;
  }

  public setPage(page: number): Promise<Array<any>> {

    this.page = page;
    return this.getData();
  }
}
