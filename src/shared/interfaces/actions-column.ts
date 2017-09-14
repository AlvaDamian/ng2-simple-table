import { BaseColumn } from './private/BaseColumn';

export interface ActionsColumn extends BaseColumn {

	/**
	* If actions columns should be displayed firts (left side).
	* false if it should be displayed last (right side).
	*/
  displayOnLeft: boolean;

  /**
  * CallBack to use before a row is displayed.
  */
  forEachRow?: Array<ActionsColumnForEachRow>;
}

export interface ActionsColumnForEachRow {

	/**
	* rowData
	* columnNumber
	* rowNumber
	*/
  callBack: (rowData: any) => string;
}
