import { Ng2ST } from './';
import { Column, ActionsColumn } from './interfaces';

export class Ng2STFactory {

  public static basic(data: Array<any>, columns: Array<Column>): Ng2ST {
    return new Ng2ST(data, columns);
  }

  public static withActions(data: Array<any>, columns: Array<Column>, actions: ActionsColumn): Ng2ST {

    let ret: Ng2ST = Ng2STFactory.basic(data, columns);

    ret.setActionsColumn(actions);

    return ret;
  }
}
