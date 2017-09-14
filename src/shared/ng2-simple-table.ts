import { EventEmitter } from '@angular/core';
import { Column, ActionsColumn, ActionsColumnForEachRow, Sort } from './interfaces';

export class Ng2ST {

	private tableClasses:string|string[]|Set<string>;
	private actions:ActionsColumn;
	private sortStrategies:Map<string, Sort>;

	private onDataChange:EventEmitter<Array<any>>;

	public constructor(
		private data:Array<any>,
		private columns:Array<Column>
	) {

		this.tableClasses= null;
		this.actions= null;
		this.sortStrategies= new Map<string, Sort>();
		this.onDataChange= new EventEmitter<Array<any>>();
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

  private addActionsToDataRow(
  	dataRow: Array<any>, originalData:any, row:number, column:number
  ): void {

    if (!this.actions) {
      return;
    }

    let actions = '';

    if (this.actions.forEachRow) {

      for (let call of this.actions.forEachRow) {

        actions += call.callBack(originalData);
      }
    }

    if (!this.actions.displayOnLeft) {
      dataRow.push(actions);
    } else {
      dataRow.unshift(actions);
    }
  }

  public replaceData(data:Array<any>):void {

		this.data= data;
	}

	public getData():Array<any> {
		return this.data;
	}

	public getColumns():Array<Column> {

		return this.columns;
	}

	public getTableClasses():string|string[]|Set<string> {

		return this.tableClasses;
	}

	public getActionsColumn():ActionsColumn {
		return this.actions;
	}

	public getValue(obj:any, column:Column):any {

		let target= column.target;

		if (obj.hasOwnProperty(target)) {
      return obj[target];
    }

    return null;
	}

	public getSortStrategies():Map<string, Sort> {
		return this.sortStrategies;
	}

	public getSortStrategy(target:string):Sort {

		if(this.sortStrategies.has(target))
			return this.sortStrategies.get(target);

		return null;
	}

	public setTableClasses(classes:string|string[]|Set<string>):void {

		this.tableClasses= classes;
	}

	public setActionsColumn(actions:ActionsColumn):void {

		this.actions= actions;

		if (this.actions && !this.actions.forEachRow) {
      this.actions.forEachRow = new Array<ActionsColumnForEachRow>();
    }

    this.addActionsToHeader(this.columns);
	}

	public addSortStrategy(target:string, strategy:Sort, replaceIfExists:boolean = true):boolean {

		let exists= this.sortStrategies.has(target);

		if(exists && !replaceIfExists)
			return false;

		this.sortStrategies.set(target, strategy);
		return true;
	}

	public sort(target:string, asc:boolean = true):Array<any> {

		let sortStrategy= this.getSortStrategy(target);
		let ret= new Array<any>();

		if(!sortStrategy)
			throw new Error("Sort strategy not found.");
		else {
			let toUse= asc ? sortStrategy.asc : sortStrategy.desc;
			ret= this.data.sort((arg0, arg1) => {
				return toUse(arg0[target], arg1[target]);
			});
		}

		return ret;
	}
}