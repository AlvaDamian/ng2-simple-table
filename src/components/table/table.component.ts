import { Component, Input, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Column } from '../../shared/interfaces';
import { Ng2ST, Ng2STCssConfiguration } from '../../shared';

@Component({

  selector: 'ng2-simple-table',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {

  data: Array<any>;
  columns: Array<Column>;
  tableClasses: string|string[]|Set<string>;
  caretAscClasses: string|string[]|Set<string>;
  caretDescClasses: string|string[]|Set<string>;

  private currentSort= {
    target:null,
    asc:false
  };

  @Input() settings:Ng2ST;

  public constructor(
    private cssConfiguration:Ng2STCssConfiguration,
    private domSanitizer:DomSanitizer
  ) { }

  public ngOnInit():void {

    this.data= this.settings.getData();
    this.columns= this.settings.getColumns();
    this.resolveCss();


    this.cssConfiguration.configurationChanged.subscribe(() => {

      this.resolveCss();
    });
  }

  private resolveCss():void {

    this.tableClasses= this.cssConfiguration.getTable();
    this.caretAscClasses= this.cssConfiguration.getCaretAsc();
    this.caretDescClasses= this.cssConfiguration.getCaretDesc();
  }

  public getValue(obj, column): any {

    return this.domSanitizer.bypassSecurityTrustHtml(this.settings.getValue(obj, column));
  }

  public canSort(col:Column): boolean {
    return this.settings.getSortStrategy(col.target) != null;
  }

  public sortByColumn($event, col:Column):void {

    $event.preventDefault();
    $event.stopPropagation();



    if(this.currentSort.target != null && this.currentSort.target == col.target){

      this.currentSort.asc= !this.currentSort.asc;
    }
    else {

      this.currentSort.target= col.target;
      this.currentSort.asc= true;
    }

    this.data= this.settings.sort(this.currentSort.target, this.currentSort.asc);
  }
}
