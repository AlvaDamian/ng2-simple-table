import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Ng2STCssConfiguration } from '../../shared';

@Component({
  selector: 'ng2-simple-table-pagination',
  templateUrl: './pagination.html'
})
export class Ng2STPaginationComponent implements OnChanges {

  @Input() current: number = 1;
  @Input() pages: number;
  @Input() max: number;

  pagesCollection: number[];


  @Output() onPageChange: EventEmitter<number>;

  //css classes
  listClass: string|string[]|Set<string>;
  itemClass: string|string[]|Set<string>;
  activeItemClass: string|string[]|Set<string>;
  linkClass: string|string[]|Set<string>;

  public constructor(
    private cssConfig: Ng2STCssConfiguration
  ) {

    this.onPageChange = new EventEmitter<number>();
  }

  public ngOnChanges(): void {

    this.resolveCssClasses();

    this.cssConfig.configurationChanged.subscribe(() => {
      this.resolveCssClasses();
    });

    this.pagesCollection = this.resolvePagesCollection();
  }

  private resolvePagesCollection(): number[] {

    let items = new Array<number>();
    let left = new Array<number>();
    let right = new Array<number>();

    if (this.max && this.max > 0) {

      items.push(this.current);

      let previous = this.current - Math.floor(this.max / 2);
      let next = this.current + Math.floor(this.max / 2);

      if (this.current > 1) {
        for (let i = this.current - 1; i >= 1 && i >= previous; i--) {
          left.unshift(i);
        }
      }

      if (this.current < this.pages) {
        for (let i = this.current + 1; i <= this.pages && i <= next; i++) {
          right.push(i);
        }
      }

      if (left.length >= 2 && left[0] > 2) {
        left.unshift(null);
        left.unshift(1);
      }

      if (right.length >= 2 && right[items.length - 1] < this.pages - 1) {

        right.push(null);
        right.push(this.pages);
      }
    } else {
      for (let i = 1; i <= this.pages; i++) {
        items.push(i);
      }
    }

    return left.concat(items).concat(right);
  }

  private resolveCssClasses(): void {

    this.listClass = this.cssConfig.getPagination();
    this.itemClass = this.cssConfig.getPaginationItem();
    this.linkClass = this.cssConfig.getPaginationLink();
    this.activeItemClass = Ng2STCssConfiguration
                                    .joinClasses(
                                      this.itemClass,
                                      this.cssConfig
                                      .getPaginationActiveItem()
                                    );
  }

  public nextPage($event): void {

    this.changePage($event, this.current + 1);
  }

  public previousPage($event): void {

    this.changePage($event, this.current - 1);
  }

  public changePage($event, pageNumber: number): void {

    $event.preventDefault();
    $event.stopPropagation();

    if (pageNumber <= 0 || pageNumber > this.pages) {
      return;
    }

    this.current = pageNumber;
    this.pagesCollection = this.resolvePagesCollection();
    this.onPageChange.emit(pageNumber);
  }

  public isEllipsis(pageNumber: number): boolean {
    return pageNumber == null;
  }
}