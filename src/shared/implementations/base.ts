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

    let resolveDefaultColumnValues = (c: Column) => {
      if (!c.isOptions && c.filter) {
        this.addFilter(c.target);
      }

      if (!c.rowspan || c.rowspan <= 0) {
        c.rowspan = 1;
      }

      if (!c.colspan || c.colspan <= 0) {
        c.colspan = 1;
      }

      if (c.subColumns && c.subColumns.length > 0) {
        c
        .subColumns
        .forEach(col => {
          resolveDefaultColumnValues(col);
        });
      }
    };

    this
    .columns
    .forEach(col => {

      resolveDefaultColumnValues(col);
    });
  }

  protected getDefaultFilter(): Filter {

    return (value: any, input: any) => {

      let v = String(value).toLowerCase();
      let i = String(input).toLowerCase();

      return v.indexOf(i) !== -1;
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

            let propertyValue = this.getPropertyValue(value, key);

            if (
              propertyValue != null
              && this.filters.has(key)
              && !this.filters.get(key)(propertyValue, val)
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

  protected getPropertyValue(obj: any, prop: string, def: any = null): any {

    let dotIndex = prop.indexOf('.');

    if (dotIndex > 0) {

      let left = prop.substring(0, dotIndex);
      let right = prop.substring(dotIndex + 1);

      if (obj.hasOwnProperty(left)) {

        return this.getPropertyValue(obj[left], right, def);
      }

      return def;
    }

    return obj.hasOwnProperty(prop) ? obj[prop] : def;
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

  public getValue(obj: any, column: Column): Ng2STComponent | Array<Ng2STComponent> | any {

    let target = column.target;
    let propertyValue = this.getPropertyValue(obj, target, "");

    if (!column.customValue) {
      return propertyValue;
    }

    if (!Array.isArray(column.customValue)) {
      return column.customValue(propertyValue, obj);
    }

    let ret= new Array<any>();

    column
    .customValue
    .forEach(custom => {
      ret.push(custom(propertyValue, obj));
    });

    return ret;
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

  public changeTitle(id: number | number[], newTitle: string): void {

    let resolve = (_id: number | number[], _column: Column, _newTitle: string) => {

      if (!Array.isArray(_id) && _column.id == _id) {
        _column.title = _newTitle
        return true;
      } else if (Array.isArray(_id) && _id.indexOf(_column.id) >= 0) {
        _column.title = _newTitle;
        return true;
      } else {
        if (_column.subColumns && _column.subColumns.length > 0) {
          _column
          .subColumns
          .forEach(_c => {
            return resolve(_id, _c, _newTitle);
          });
        }
      }
    }

    this
    .columns
    .forEach(col => {
      if (resolve(id, col, newTitle)) {
        return;
      }
    });
  }
}
