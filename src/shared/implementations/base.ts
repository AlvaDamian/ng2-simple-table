import { Filter, Sort, Column, Ng2ST, Ng2STComponent } from '../interfaces';

export abstract class BaseImplementation<T> implements Ng2ST<T> {

  private filters: Map<string, Filter>;
  private appliedFilters: Map<string, any>;
  private columns: Array<Column>;
  private page: number;
  private perPage: number;

  abstract getData(): Promise<Array<any>>;
  abstract getNumberOfPages(): number;
  abstract getSortStrategy(target: string): T;
  abstract sort(target: string): void;
  abstract hasSortStrategy(target: string): boolean;
  abstract addSortStrategy(target: string | string[], sortStrategy?: T, replace?: boolean): string[];

  constructor(columns: Array<Column>) {

    this.columns= columns;
    this.filters = new Map<string, Filter>();
    this.appliedFilters = new Map<string, any>();

    this
    .columns
    .forEach(col => {
      if (!col.isOptions && col.filter) {
        this.addFilter(col.target);
      }
    });
  }

  protected getDefaultFilter(): Filter {

    return {
      filter: (value: any, input: any) => {

      let v = (value as string).toLowerCase();
      let i = (input as string).toLowerCase();


      return v.indexOf(i) !== -1;
      }
    }
  }

  protected getDefaultSort(): Sort {
    return {
      asc: (arg0, arg1) => arg0 == arg1 ? 0 : (arg0 > arg1 ? 1 : -1),
      desc: (arg0, arg1) => arg0 == arg1 ? 0 : (arg0 < arg1 ? 1 : -1)
    };
  }

  protected calculateNumberOfPages(total: number, perPage: number): number {

    let calc = total / perPage;
    let fixedValue = Math.floor(calc);

    return fixedValue === calc ? fixedValue : fixedValue + 1;
  }

  protected pageData(data: Array<any>, page: number, perPage: number): Array<any> {

    let ret = new Array<any>();

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

  protected filterData(data: Array<any>): Array<any> {

    let ret= Array.from(data);

    ret = ret
          .filter((value) => {

          let pass = true;

          this
          .appliedFilters
          .forEach((val, key) => {

            if (
              this.filters.has(key)
              && value.hasOwnProperty(key)
              && !this.filters.get(key).filter(value[key], val)
            ) {
              pass = false;
            }
          });

          return pass;
        });


    return ret;
  }

  protected getPerPage(): number {
    return this.perPage;
  }

  public addFilter(target: string, filter?: Filter): void {

    if (!filter) {
      filter = this.getDefaultFilter();
    }

    this.filters.set(target, filter);
  }

  public removeFilter(target: string): void {

    this.appliedFilters.delete(target);
  }

  public hasFilter(column: Column): boolean {

    if (column.isOptions) {
      return false;
    }

    return this.filters.has(column.target);
  }

  public applyFilter(target: string, value: any): void {
    this.appliedFilters.set(target, value);
  }

  public getValue(obj: any, column: Column): Array<Ng2STComponent> | Array<any> | any {

    let target = column.target;

    if (obj.hasOwnProperty(target)) {

      if (column.customValue) {

        if (Array.isArray(column.customValue)) {

          let ret= new Array<any>();

          column
          .customValue
          .forEach(v => {
            ret.push(v(obj[target], obj));
          });

          return ret;
        } else {
          return column.customValue(obj[target], obj);
        }
      }

      return obj[target];
    }

    return null;
  }

  public getColumns(): Array<Column> {

    return this.columns;
  }

  public getPage(): number {
    return this.page;
  }

  public setPage(page: number): void {
    this.page = page;
  }

  public addPagination(initialPage: number, perPage: number): void {

    this.page = initialPage;
    this.perPage = perPage;
  }
}
