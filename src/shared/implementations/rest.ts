import { Ng2ST, RESTSort, Sort, Column, ActionsColumn, ActionsColumnForEachRow } from '../interfaces';
import { get } from 'request';

export class Ng2STREST implements Ng2ST<Sort | RESTSort> {

  private DEFAULT_ACTIONS_TARGET= 'Ng2STActionsColumn';

  private actions: ActionsColumn;
  private lastData: {
    data: Array<any>,
    page: number,
    perPage: number
  };

  // Pagination
  private page: number;
  private perPage: number;
  private totalsPage: number;

  // Request params
  private pageParam: string;
  private perPageParam: string;

  // Response params
  private totalsPageParam: string;
  private dataParam: string;

  private actionsTarget: string;

  // Sort
  private sortTarget: string;
  private sortAsc: boolean;
  private sortStrategies: Map<string, Sort | RESTSort>;

  constructor(
    private url: string,
    private columns: Array<Column>,
    dataResponseParam?: string,
    pageRequestParam?: string,
    perPageRequestParam?: string,
    totalPagesResponseParam?: string
  ) {

    this.sortStrategies = new Map<string, Sort | RESTSort>();
    this.lastData = {
      data: new Array<any>(),
      page: undefined,
      perPage: undefined
    };

    if (dataResponseParam) { this.dataParam = dataResponseParam; }
    if (pageRequestParam) { this.pageParam = pageRequestParam; }
    if (perPageRequestParam) { this.perPageParam = perPageRequestParam; }
    if (totalPagesResponseParam) { this.totalsPageParam = totalPagesResponseParam; }
  }

  public getData(): Promise<Array<any>> {
    return new Promise((resolve, reject) => {

      let url = this.createUrl();
      let ret: Array<any>;

      get(url, { json: true }, (error, response, body) => {

        if (error) {
          reject(error);
        }

        let result = body;



        if (this.dataParam && result.hasOwnProperty(this.dataParam)) {

          this.lastData = result[this.dataParam];
          ret = this.lastData.data;
        } else {
          if (Array.isArray(result)) {
            this.lastData.data = result;
            ret = this.lastData.data;
          } else {
            reject('Coulnd\'t parse server response.');
          }
        }

        if (this.totalsPageParam && result.hasOwnPropert(this.totalsPageParam)) {
          this.totalsPage = result[this.totalsPageParam];
        }

        if (this.sortTarget && this.hasSortStrategy(this.sortTarget)) {

          let strategy = this.getSortStrategy(this.sortTarget);
          let toUse: (arg0: any, arg1: any) => number;

          if (this.sortAsc && typeof strategy.asc !== 'string') {
            toUse = strategy.asc;
          } else if (!this.sortAsc && typeof strategy.desc !== 'string') {
            toUse = strategy.desc;
          }

          if (toUse) {
            ret = ret.sort(toUse);
          }
        }

        if (!this.pageParam && !this.perPageParam && this.page && this.perPage) {

          let calc = this.lastData.data.length / this.perPage;
          let fixedValue = Math.floor(calc);

          this.totalsPage = fixedValue === calc ? fixedValue : fixedValue + 1;

          ret = this.pageResponse(this.lastData.data, this.page, this.perPage);
        }

        resolve(ret);
      });
    });
  }

  public getColumns(): Array<Column> {
    return this.columns;
  }

  public getNumberOfPages(): number {
    return this.totalsPage;
  }

  public getPage(): number {
    return this.page;
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

  public getActionsColumn(): ActionsColumn {
    return this.actions;
  }

  public getSortStrategy(target: string): Sort | RESTSort {

    if (this.hasSortStrategy(target)) {
      return this.sortStrategies.get(target);
    }

    return null;
  }

  public setPage(page: number): void {
    this.page = page;
  }

  public setActionsColumn(column: ActionsColumn): void {

    this.actions = column;

    if (this.actions && !this.actions.forEachRow) {
      this.actions.forEachRow = new Array<ActionsColumnForEachRow>();
    }

    this.addActionsToHeader(this.columns);
  }

  public sort(target: string, asc = true): void {
    this.sortTarget = target;
    this.sortAsc = asc;
  }

  public hasSortStrategy(target: string): boolean {
    return this.sortStrategies.has(target);
  }

  public addSortStrategy(
    target: string | string[],
    strategy?: Sort | RESTSort,
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

  public addPagination(initialPage: number, perPage: number): void {

    this.page = initialPage;
    this.perPage = perPage;
  }

  private createUrl(): string {

    let ret: string = this.url;
    let questionIndex: number = ret.indexOf('?');

    if (questionIndex < 0) {
      ret = ret.concat('?');
    } else if (questionIndex < ret.length - 1) {
      ret = ret.concat('&');
    }

    if (this.perPageParam && this.pageParam) {
      ret = ret.concat(this.pageParam).concat('=').concat(this.page.toString());
      ret = ret.concat('&').concat(this.perPageParam).concat('=').concat(this.perPage.toString());
    }

    if (this.sortTarget && this.hasSortStrategy(this.sortTarget)) {

      let strategy = this.getSortStrategy(this.sortTarget);

      if (this.sortAsc && typeof strategy.asc === 'string') {
        ret = ret.concat(strategy.asc as string);
      } else if (!this.sortAsc && typeof strategy.desc === 'string') {
        ret = ret.concat(strategy.desc as  string);
      }
    }

    return ret;
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

  private resolveActionsColumnTarget(columns: Array<Column>, desiredResult: string): string {

    let exists = columns.find(value => value.target === desiredResult) != null;

    return !exists ?
            desiredResult :
            this.resolveActionsColumnTarget(columns, desiredResult + desiredResult);
  }

  private pageResponse(data: Array<any>, page: number, perPage: number): Array<any> {

    let ret: Array<any> = new Array<any>();

    if (data.length - (page - 1) * perPage <= 0) {
      return ret;
    }

    let index: number;
    for (let i = 0; i < perPage; i++) {

      index = perPage * (page - 1) + i;

      if (index >= data.length) {
        break;
      }

      ret.push(data[index]);
    }

    return ret;
  }
}
