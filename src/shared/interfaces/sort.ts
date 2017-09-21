/**
* Sorting functionality.
*/
export interface Sort {

  /**
  * Sorting function to use in ascending order.
  *
  * @param arg0 First value.
  * @param arg1 Second value.
  *
  * @return
  *   - 0 if @arg0 equals @arg1.
  *   - 1 if @arg0 is greater than @arg1.
  *   - -1 if @arg0 is lower than @arg1.
  */
  asc: (arg0: any, arg1: any) => number;

  /**
  * Sorting function to use in descending order.
  *
  * @param arg0 First value.
  * @param arg1 Second value.
  *
  * @return
  *   - 0 if @arg0 equals @arg1.
  *   - 1 if @arg0 is lower than @arg1.
  *   - -1 if @arg0 is greater than @arg1.
  */
  desc: (arg0: any, arg1: any) => number;
}
