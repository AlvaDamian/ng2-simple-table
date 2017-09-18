import { Ng2ST } from '../interfaces';
import { Ng2STAutonomous, Ng2STREST } from '../implementations';
import { Column, ActionsColumn, Sort, RESTSort } from '../interfaces';

export class Ng2STFactory {

  public static createAutonomous(
    data: Array<any>,
    columns: Array<Column>,
    actions?: ActionsColumn,
    sorts?: Array<{ target: string, strategy: Sort }>,
    initialPage?: number,
    perPage?: number
  ): Ng2ST<Sort> {

    let ret = new Ng2STAutonomous(data, columns);

    if (actions) {
      ret.setActionsColumn(actions);
    }

    if (sorts) {
      sorts.forEach(value => {
        ret.addSortStrategy(value.target, value.strategy);
      });
    }

    if (initialPage && perPage) {
      ret.addPagination(initialPage, perPage);
    }

    return ret;
  }

  public static createREST(
    url: string,
    columns: Array<Column>,
    dataResponseParam?: string,
    pageRequestParam?: string,
    perPageRequestParam?: string,
    totalsPageResponseParam?: string
  ): Ng2ST<Sort | RESTSort> {

    let ret = new Ng2STREST(
                url,
                columns,
                dataResponseParam,
                pageRequestParam,
                perPageRequestParam,
                totalsPageResponseParam
              );

    return ret;
  }
}
