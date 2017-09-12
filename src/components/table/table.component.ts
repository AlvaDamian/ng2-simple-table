import { Component, Input, OnInit} from '@angular/core';
import { Actionscolumn, ActionsColumnForEachRow, Column } from '../../shared/interfaces';

@Component({

  selector: 'ng2-simple-table',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {

  @Input('data') data: Array<any>;
  @Input('columns') columns: Array<Column>;
  @Input('classes') classes: string|string[]|Set<string>;
  @Input('actions') actions: Actionscolumn;

  currentRow: number;
  currentCol: number;

  public ngOnInit(): void {

    if (!this.actions.forEachRow) {
      this.actions.forEachRow = new Array<ActionsColumnForEachRow>();
    }

    this.addActionsToHeader(this.columns);
  }

  public values(obj): Array<any> {

    let ret: Array<any> = new Array<any>();
    let keys: Array<string> = Object.getOwnPropertyNames(obj);

    for (let k of keys) {
      ret.push(obj[k]);
    }

    this.addActionsToDataRow(ret, obj);
    return ret;
  }

  public getValue(obj, target: string): any {

    if(obj.hasOwnProperty(target))
      return obj[target];

    return null;
  }

  private addActionsToDataRow(row: Array<any>, originalData: any): void {

    if (!this.actions) {
      return;
    }

    let actions = '';

    if (this.actions.forEachRow) {

      for (let call of this.actions.forEachRow) {

        if (call.callBack) {
          actions = call.callBack(originalData, this.currentCol, this.currentRow);
        }
      }
    }

    if (!this.actions.displayOnLeft) {
      row.push(actions);
    } else {
      row.unshift(actions);
    }
  }

  private addActionsToHeader(header: Array<any>): void {

    if (!this.actions) {
      return;
    }

    let toAdd = {title: this.actions.title};

    if (this.actions.displayOnLeft) {
      header.unshift(toAdd);
    } else {
      header.push(toAdd);
    }
  }
}
