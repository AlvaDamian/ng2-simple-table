import { Column, Filter, Pagination, Ng2STComponent } from './';

/**
* Core functionality.
*
* @type T Sort type.
*/
export interface Ng2ST<T> {

  /**
  * Gets data to be displayed.
  */
  getData(): Promise<Array<any>>;

  /**
  * Gets columns to be displayed.
  */
  getColumns(): Array<Column>;

  /**
  * @return The number of pages to use.
  */
  getNumberOfPages(): number;

  /**
  * Returns the current page number.
  */
  getPage(): number;

  /**
  * Gets the value of an object for a given column.
  *
  * @param obj: The object that holds the information.
  * @param column: Column from where to get the value.
  *
  * @return The asked value or null if doesn't exists.
  */
  getValue(obj: any, column: Column): Ng2STComponent | Array<Ng2STComponent> | any;

  /**
  * Gets the sort strategy used for target.
  */
  getSortStrategy(target: string): T;

  /**
  * Changes the current page.
  *
  * @param page The new page.
  */
  setPage(page: number): void;

  /**
  * Sorts data using the strategy for target.
  * The strategy to use must be set or an error will be raised.
  *
  * @param target Property to use for sorting.
  * @param asc If has to be sorted in ascending order.
  *        false if it has to be descending.
  */
  sort(target: string, asc: boolean): void;

  /**
  * Determines whether there exists the sort strategy for the given target.
  *
  * @param target
  *
  * @return If exists a sorting strategy.
  */
  hasSortStrategy(target: string): boolean;

  /**
  * Adds or replace a sort strategy for the target or group of targets.
  * The same strategy will be added to all targets.
  *
  * @param target Property or group of properties by wich data should be sorted.
  * @param sortStrategy Sort strategy to use.
  *        If it is not set, a default sort strategy will be used.
  * @param replace If a sort strategy is found, TRUE by default.
  *
  * @return The list of targets that got added.
  */
  addSortStrategy(
    target: string | string[],
    sortStrategy?: T,
    replace?: boolean
  ): string[];

  /**
  * Adds pagination.
  *
  * @param initialPage First page to display.
  * @param perPage Number or items per page.
  */
  addPagination(initialPage: number, perPage: number): void;

  /**
  * Adds a filter for the target.
  *
  * @param target Object property to filter.
  * @param filter Filter to use. If is not set, a default filter will be used.
  */
  addFilter(target: string, filter?: Filter): void;

  /**
  * Use the given filter in @addFilter(string, ?filter) for the @target
  * with @value
  *
  * @param target Object property to filter.
  * @param value Value to use.
  */
  applyFilter(target: string, value: any): void;

  /**
  * Remove a filter given for @target.
  *
  * @param target Object property.
  */
  removeFilter(target: string): void;

  /**
  * Returns if a column has a filter that can be used.
  *
  * @param column The column.
  *
  * @return If the column has a filter that can be used or not.
  */
  hasFilter(column: Column): boolean;

  /**
  * Sets the title @newTitle to the column that has the id @id.
  *
  * @param id The ID of the column.
  * @param newTitle New title for the column.
  */
  changeTitle(id: number | number[], newTitle: string): void;
}
