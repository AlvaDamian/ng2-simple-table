import { Ng2ST, RESTSort, Sort, Column,
         Filter } from '../interfaces';
import { get } from 'request';
import { BaseImplementation } from './base';

export class Ng2STREST extends BaseImplementation<Sort | RESTSort> {

  private lastData: {
    data: Array<any>,
    page: number,
    perPage: number
  };

  // Pagination
  private totalsPage: number;

  // Request params
  private pageParam: string;
  private perPageParam: string;

  // Response params
  private totalsPageParam: string;
  private dataParam: string;

  // Sort
  private sortTarget: string;
  private sortAsc: boolean;
  private sortStrategies: Map<string, Sort | RESTSort>;

  constructor(
    private url: string,
    columns: Array<Column>,
    dataResponseParam?: string,
    pageRequestParam?: string,
    perPageRequestParam?: string,
    totalPagesResponseParam?: string
  ) {

    super(columns);
    this.sortStrategies = new Map<string, Sort | RESTSort>();
    this.lastData = {
      data: new Array<any>(),
      page: undefined,
      perPage: undefined
    };

    if (dataResponseParam) { this.dataParam = dataResponseParam; }
    if (pageRequestParam) { this.pageParam = pageRequestParam; }
    if (perPageRequestParam) { this.perPageParam = perPageRequestParam; }
    if (totalPagesResponseParam) {
      this.totalsPageParam = totalPagesResponseParam;
    }
  }

  public getData(): Promise<Array<any>> {
    return new Promise((resolve, reject) => {

      let url = this.createUrl();
      let ret: Array<any>;
      let page = this.getPage();
      let perPage = this.getPerPage();

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

        if (
            this.totalsPageParam
            && result.hasOwnPropert(this.totalsPageParam)
          ) {

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

        if (
            !this.pageParam
            && !this.perPageParam
            && page
            && perPage
          ) {

          let calc = this.lastData.data.length / perPage;
          let fixedValue = Math.floor(calc);

          this.totalsPage = fixedValue === calc ? fixedValue : fixedValue + 1;

          ret = this.pageData(this.lastData.data, page, perPage);
        }

        resolve(ret);
      });
    });
  }

  public getNumberOfPages(): number {
    return this.totalsPage;
  }

  public getSortStrategy(target: string): Sort | RESTSort {

    if (this.hasSortStrategy(target)) {
      return this.sortStrategies.get(target);
    }

    return null;
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

  private createUrl(): string {

    let ret: string = this.url;
    let questionIndex: number = ret.indexOf('?');

    if (questionIndex < 0) {
      ret = ret.concat('?');
    } else if (questionIndex < ret.length - 1) {
      ret = ret.concat('&');
    }

    if (this.perPageParam && this.pageParam) {
      ret = ret
            .concat(this.pageParam)
            .concat('=')
            .concat(this.getPage().toString());

      ret = ret
            .concat('&')
            .concat(this.perPageParam)
            .concat('=')
            .concat(this.getPerPage().toString());
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
}
