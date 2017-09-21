import { BaseColumn } from './private/BaseColumn';
import { Ng2STComponent } from './';

/**
* Represents a Column in the table.
*/
export interface Column extends BaseColumn {

  /**
  * Property that this column matchs.
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
  customValue?: ((value: any, fullObject?: any) => Ng2STComponent | Array<Ng2STComponent> | any) | Array<(value: any, fullObject?: any) => Ng2STComponent | Array<Ng2STComponent> | any>;

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
  * If this represents a columns options and should not be sorted or filtered.
  */
  isOptions?: boolean;
}
