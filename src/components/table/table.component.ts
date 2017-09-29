import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Column, Ng2STComponent } from '../../shared/interfaces';
import { Ng2ST, Ng2STCssConfiguration } from '../../shared';

@Component({

  selector: 'ng2-simple-table',
  templateUrl: './table.component.html'
})
export class Ng2STTableComponent implements OnInit, OnChanges {

  //events
  @Output() onRowSelect: EventEmitter<any>;

  loading: boolean;
  showFilters: boolean;
  data: Array<any>;
  columns: Array<Column>;
  header: Array<Array<Column>>;
  tableClasses: string|string[]|Set<string>;
  caretAscClasses: string|string[]|Set<string>;
  caretDescClasses: string|string[]|Set<string>;

  // pagination
  currentPage: number;
  numberOfPages: number;

  filterControlClasses: string | string[] | Set<string>;

  currentSort = {
    target: null,
    asc: false
  };

  @Input() settings: Ng2ST<any>;
  @Input() maxPages: number;

  public constructor(
    private cssConfiguration: Ng2STCssConfiguration,
    private domSanitizer: DomSanitizer
  ) {
    this.onRowSelect = new EventEmitter<number>();
    this.loading = false;
    this.data = [];
    this.columns = [];
    this.header= [];
    this.showFilters = false;
  }

  public ngOnInit(): void {

    this.resolveCss();

    this.cssConfiguration.configurationChanged.subscribe(() => {

      this.resolveCss();
    });
  }

  public ngOnChanges(): void {

    this.columns = this.settings.getColumns();
    this.currentPage = this.settings.getPage();

    let rowQuantity = this.calculateRows(this.columns);

    this.header = new Array<Array<Column>>();
    for (let i = 1; i <= rowQuantity; i++) {

      this.header.push(this.resolveHeader(i, this.columns));
    }

    this.resolveData();
  }

  private resolveCss(): void {

    this.tableClasses = this.cssConfiguration.getTable();
    this.caretAscClasses = this.cssConfiguration.getCaretAsc();
    this.caretDescClasses = this.cssConfiguration.getCaretDesc();

    this.filterControlClasses = this.cssConfiguration.getFilterControl();
  }

  public getValue(obj, column): any {

    return this.settings.getValue(obj, column);
  }

  public isArray(value: any): boolean {
    return Array.isArray(value);
  }

  public isPrimitive(value: any): boolean {
    return !(typeof value === 'object' || typeof value === 'function');
  }

  public canSort(col: Column): boolean {
    return this.settings.hasSortStrategy(col.target);
  }

  public canFilter(col: Column): boolean {
    return this.settings.hasFilter(col);
  }

  public sortByColumn($event, col: Column): void {

    $event.preventDefault();
    $event.stopPropagation();

    if (
        this.currentSort.target !== null
        && this.currentSort.target === col.target
       ) {

      this.currentSort.asc = !this.currentSort.asc;
    } else {

      this.currentSort.target = col.target;
      this.currentSort.asc = true;
    }

    this.settings.sort(this.currentSort.target, this.currentSort.asc);
    this.resolveData();
  }

  public addFilter($event, column: Column): boolean {

    let value: string = $event.target.value;

    if (value === '') {
      $event.preventDefault();
      $event.stopPropagation();
    }

    if (value.length === 0) {
      this.settings.removeFilter(column.target);
    } else {
      this.settings.applyFilter(column.target, value);
    }

    this.resolveData();
    return false;
  }

  public changePage(page: number): void {

    this.settings.setPage(page);
    this.resolveData();
  }

  public emitOnRowSelect(object: any): void {
    this.onRowSelect.emit(object);
  }

  public hasSubColumns(column: Column): boolean {
    return column.subColumns && column.subColumns.length > 0;
  }

  public subColumns(column: Column): Array<Column> {
    return this.hasSubColumns(column) ? column.subColumns : new Array<Column>();
  }

  public columnCount(columns = this.columns): number {

    let total = 0;

    columns
    .forEach(col => {

      total += !this.hasSubColumns(col) ? 1 : this.columnCount(col.subColumns);
    });

    return total;
  }

  private resolveData(): void {
    this.loading = true;
    this.data = new Array<any>();

    this
    .settings
    .getData()
    .then(d => {
      this.data = d;
      this.numberOfPages = this.settings.getNumberOfPages();
      this.loading = false;
    })
    .catch(e => {

      this.loading = false;
      console.error('An error has ocurred while trying to fetch data: ', e);
    });
  }

  private resolveHeader(level: number, cols: Array<Column>): Array<Column> {

    let ret = new Array<Column>();

    cols
    .forEach(col => {

      if (level == 1) {
        ret.push(col);
      } else if (this.hasSubColumns(col)) {
        ret = ret.concat(this.resolveHeader(level - 1, this.subColumns(col)));
      }
    });

    return ret;
  }

  private calculateRows(columns: Array<Column>): number {

    let total = 1;

    let getTotalForColumn = (col: Column) => {

      let ret = 1;

      if (col.subColumns && col.subColumns.length > 0) {

        let innerTotal = 1;

        col
        .subColumns
        .forEach(subCol => {
          let temp = getTotalForColumn(subCol);

          if (temp > innerTotal) {
            innerTotal = temp;
          }
        });

        ret += innerTotal;
      }

      return ret;
    }

    columns
    .forEach(c => {

      let currentTotal = getTotalForColumn(c);

      if (currentTotal > total) {
        total = currentTotal;
      }
    });

    return total;
  }
}
