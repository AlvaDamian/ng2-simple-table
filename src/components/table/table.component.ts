import { Component, Input, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Column } from '../../shared/interfaces';
import { Ng2ST, Ng2STCssConfiguration } from '../../shared';

@Component({

  selector: 'ng2-simple-table',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {

  loading: boolean;
  data: Array<any>;
  columns: Array<Column>;
  tableClasses: string|string[]|Set<string>;
  caretAscClasses: string|string[]|Set<string>;
  caretDescClasses: string|string[]|Set<string>;

  // pagination
  currentPage: number;
  numberOfPages: number;
  numberOfPagesRange: Array<number>;
  paginationClass: string|string[]|Set<string>;
  paginationItemClass: string|string[]|Set<string>;
  paginationLinkClass: string|string[]|Set<string>;
  paginationActiveItemClass: string|string[]|Set<string>;

  currentSort = {
    target: null,
    asc: false
  };

  @Input() settings: Ng2ST<any>;

  public constructor(
    private cssConfiguration: Ng2STCssConfiguration,
    private domSanitizer: DomSanitizer
  ) {
    this.loading = false;
    this.data = new Array<any>();
    this.columns = new Array<Column>();
  }

  public ngOnInit(): void {

    this.columns = this.settings.getColumns();
    this.currentPage = this.settings.getPage();
    this.resolveCss();
    this.resolveData();

    this.cssConfiguration.configurationChanged.subscribe(() => {

      this.resolveCss();
    });
  }

  private resolveCss(): void {

    this.tableClasses = this.cssConfiguration.getTable();
    this.caretAscClasses = this.cssConfiguration.getCaretAsc();
    this.caretDescClasses = this.cssConfiguration.getCaretDesc();
    this.paginationClass = this.cssConfiguration.getPagination();
    this.paginationItemClass = this.cssConfiguration.getPaginationItem();
    this.paginationLinkClass = this.cssConfiguration.getPaginationLink();
    this.paginationActiveItemClass = Ng2STCssConfiguration
                                    .joinClasses(
                                      this.paginationItemClass,
                                      this.cssConfiguration.getPaginationActiveItem()
                                    );
  }

  public getValue(obj, column): any {

    return this.domSanitizer.bypassSecurityTrustHtml(this.settings.getValue(obj, column));
  }

  public canSort(col: Column): boolean {
    return this.settings.hasSortStrategy(col.target);
  }

  public sortByColumn($event, col: Column): void {

    $event.preventDefault();
    $event.stopPropagation();

    if (this.currentSort.target !== null && this.currentSort.target === col.target) {

      this.currentSort.asc = !this.currentSort.asc;
    } else {

      this.currentSort.target = col.target;
      this.currentSort.asc = true;
    }

    this.settings.sort(this.currentSort.target, this.currentSort.asc);
    this.resolveData();
  }

  public nextPage($event): void {

    $event.preventDefault();
    $event.stopPropagation();

    this.changeCurrentPage(this.currentPage + 1);
  }

  public previousPage($event): void {

    $event.preventDefault();
    $event.stopPropagation();

    this.changeCurrentPage(this.currentPage - 1);
  }

  public changePage($event, pageNumber: number): void {

    $event.preventDefault();
    $event.stopPropagation();

    this.changeCurrentPage(pageNumber);
  }

  private changeCurrentPage(page: number): void {

    if (page === 0 || page > this.numberOfPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.settings.setPage(this.currentPage);
    this.resolveData();
  }

  private createRange(total: number): Array<number> {

    let items = new Array<number>();
    for (let i = 1; i <= total; i++) {
       items.push(i);
    }
    return items;
  }

  private resolveData(): void {
    this.loading = true;

    this
    .settings
    .getData()
    .then(d => {
      this.data = d;
      this.numberOfPages = this.settings.getNumberOfPages();
      this.numberOfPagesRange = this.createRange(this.numberOfPages);
      this.loading = false;
    })
    .catch(e => {

      this.loading = false;
      console.error('An error has ocurred while trying to fetch data: ', e);
    });
  }
}
