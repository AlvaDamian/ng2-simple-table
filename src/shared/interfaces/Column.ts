import { BaseColumn } from './private/BaseColumn';
import { Ng2STComponent } from './';

export type CustomValueType = (value: any, fullObject?: any) => Ng2STComponent
                              | any;

/**
* Represents a Column in the table.
*/
export interface Column extends BaseColumn {

  /**
  * Property that this column matchs.
  *
  * It can have dot notation if property is an object. For example:
  * 'nestedObject.id' will get the value 7 from { nestedValue: { id: 7 } }
  */
  target: string;

  /**
  * This column must display a custom value and not a simple string.
  *
  * @param value Value beign displayed.
  * @param fullObject Object related to @value.
  *
  * @return What has to be displayed.
  */
  customValue?: CustomValueType | Array<CustomValueType>;

  /**
  * Add a default filter for this column.
  *
  * Notice: May not be used in some implementations.
  */
  filter?: boolean;

  /**
  * Add a default strategy for this column.
  *
  * Notice: May not me used in some implementations.
  */
  sort?: boolean;

  /**
  * If this represents a column with options and should not be sorted or filtered.
  */
  isOptions?: boolean;

  /**
  * Sub columns for this column.
  */
  subColumns?: Array<Column>;

  /**
  * Number of columns that this instance occupies. Usefull when @subColumns is setted
  * on any column.
  *
  * Default 1.
  */
  colspan?: number;

  /**
  * Number of rows that this instance occupies. Usefull when @subColumns is setted
  * on any column.
  *
  * Default 1.
  */
  rowspan?: number;
}
