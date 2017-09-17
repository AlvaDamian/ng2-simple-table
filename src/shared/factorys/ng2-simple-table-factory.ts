import { Ng2ST } from '../interfaces';
import { Ng2STAutonomous } from '../implementations';
import { Column, ActionsColumn, Sort } from '../interfaces';

export class Ng2STFactory {

  public static basic(data: Array<any>, columns: Array<Column>): Ng2ST<Sort> {
    return new Ng2STAutonomous(data, columns);
  }

  public static withActions(data: Array<any>, columns: Array<Column>, actions: ActionsColumn): Ng2ST<Sort> {

    let ret = Ng2STFactory.basic(data, columns);

    ret.setActionsColumn(actions);

    return ret;
  }
}
