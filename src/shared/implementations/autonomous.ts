import { EventEmitter } from '@angular/core';
import { Column, Sort, Ng2ST, Filter } from '../interfaces';
import { BaseImplementation } from './base';

export class Ng2STAutonomous extends BaseImplementation<Sort> {


  private sortStrategies: Map<string, Sort>;

  private onDataChange: EventEmitter<Array<any>>;

  public constructor(
    private data: Array<any>,
    columns: Array<Column>
  ) {

    super(columns);
    this.sortStrategies = new Map<string, Sort>();
    this.onDataChange = new EventEmitter<Array<any>>();
  }

  public replaceData(data: Array<any>): void {

    this.data = data;
  }

  public getData(): Promise<Array<any>> {

    let page = this.getPage();
    let perPage = this.getPerPage();

    if (!page || !perPage) {
      return new Promise((resolve) => resolve(this.filterData(this.data)));
    }

    let ret: Array<any> = new Array<any>();

    if (this.data.length - (page - 1) * perPage <= 0) {
      return new Promise((resolve) => resolve(ret));
    }

    ret = this.pageData(this.filterData(this.data), page, perPage);
    return new Promise((resolve) => resolve(ret));
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

  public addSortStrategy(
    target: string | string[],
    strategy?: Sort,
    replaceIfExists = true
  ): string[] {

    let exists = false;
    let ret = new Array<string>();
    let toLoop: Array<string>;

    if (typeof target === 'string') {
      toLoop = new Array<string>();
      toLoop.push(target);
    } else if (Array.isArray(target)) {
      toLoop = target;
    }

    if (!strategy) {
      strategy = {
        asc: (arg0, arg1) => arg0 === arg1 ? 0 : (arg0 > arg1 ? 1 : -1),
        desc: (arg0, arg1) => arg0 === arg1 ? 0 : (arg0 < arg1 ? 1 : -1)
      };
    }

    toLoop
    .forEach(t => {

      exists = this.hasSortStrategy(t);

      if (exists && !replaceIfExists) {
        return;
      }

      this.sortStrategies.set(t, strategy);
      ret.push(t);
    });


    return ret;
  }

  public sort(target: string, asc = true): void {

    if (!this.hasSortStrategy(target)) {
      return;
    }

    let sortStrategy = this.getSortStrategy(target);

    let toUse = asc ? sortStrategy.asc : sortStrategy.desc;
    this.data = this.data.sort(
                  (arg0, arg1) => toUse(arg0[target], arg1[target])
                );
  }

  public getNumberOfPages(): number {

    return this.calculateNumberOfPages(this.data.length, this.getPerPage());
  }
}
