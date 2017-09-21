/**
* Basic filter functionality.
*/
export interface Filter {

  /**
  * Function to use to filter data.
  *
  * @param value Value to compare or do filter functionality.
  * @param input The input from the user.
  *
  * @return If @value has passed the filter.
  */
  filter: (value: any, input: any) => boolean;
}
