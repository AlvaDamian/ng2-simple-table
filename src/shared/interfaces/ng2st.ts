import { Column, ActionsColumn } from './';

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
  getValue(obj: any, column: Column): any;

  /**
  * Obtains the current actions.
  */
  getActionsColumn(): ActionsColumn;

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
  * Sets the actions column.
  *
  * @param column Actions column to be used.
  */
  setActionsColumn(column: ActionsColumn): void;

  /**
  * Sorts data using the strategy for target.
  * The strategy to use must be set or an error will be raised.
  *
  * @param target Property to use for sorting.
  * @param asc If has to be sorted in ascending order. false it has to be descending.
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
  * Adds or replace a sort strategy for the target.
  *
  * @param target Property by wich data should be sorted.
  * @param sortStrategy Sort strategy to use. It it is not set, a default sort strategy will be used.
  * @param replace If a sort strategy is found, replace it or not. TRUE by default.
  */
  addSortStrategy(target: string, sortStrategy?: T, replace?: boolean): void;

  /**
  * Adds pagination.
  *
  * @param initialPage First page to display.
  * @param perPage Number or items per page.
  */
  addPagination(initialPage: number, perPage: number): void;
}
