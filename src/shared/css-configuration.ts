import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class Ng2STCssConfiguration {

	public configurationChanged:EventEmitter<void>;

	private tableClass:string | Array<string> | Set<string>;
	private caretAscClass:string | Array<string> | Set<string>;
	private caretDesClass:string | string[] | Set<string>;;

	constructor() {
		this.configurationChanged= new EventEmitter<void>();
	}

	public setTable(css:string | Array<string> | Set<string>):void {
		this.tableClass= css;
		this.configurationChanged.emit();
	}

	public setCaretAsc(css:string | Array<string> | Set<string>):void {
		this.caretAscClass= css;
		this.configurationChanged.emit();
	}

	public setCaretDesc(css:string | Array<string> | Set<string>):void {
		this.caretDesClass= css;
		this.configurationChanged.emit();
	}

	public getTable():string | Array<string> | Set<string> {
		return this.tableClass;
	}

	public getCaretAsc():string | Array<string> | Set<string> {
		return this.caretAscClass;
	}

	public getCaretDesc():string | Array<string> | Set<string> {
		return this.caretDesClass;
	}
}