# ng2-simple-table

## Installation

To install this library, run:

```bash
$ npm install ng2-simple-table --save
```

## Use

### Configuration

From your root module:

```typescript
...
import { Ng2SimpleTableModule } from 'ng2-simple-table';

@NgModule({
  ...
  imports: [
    ...,
    Ng2SimpleTableModule.forRoot(),
    ...
  ],
  ..
})
export class AppModule { }
```

From your root component (This is optional, it will be used to set global css classes).

```typescript
...
import { Ng2STCssConfiguration } from 'ng2-simple-table';

@Component({
  ...
})
export class AppComponent {

  constructor (private ng2STCssConfiguration:Ng2STCssConfiguration) {

    /**
    * This will add classes to the html tag '<Table/>' using [ngClass]
    */
    this.ng2STCssConfiguration.setTable("table table-bordered table-sm table-striped");

    /**
    * If a column can be sorted, 2 elements will be added next to the title
    *
    * <a ...>
    *   <i [ngClass]="caretAscClasses"></i>
    * </a>
    *
    * <a ...>
    *   <i [ngClass]="caretDescClasses"></i>
    * </a>
    *
    * The '<i/>' tag from the first '<a>' tag will get css classes from 'setCaretAsc'.
    * The '<i/>' tag from the second '<a>' tag will get css classes from 'setCaretDesc'.
    *
    * This example uses FontAwesome.
    */
    this.ng2STCssConfiguration.setCaretAsc("fa fa-caret-up");
    this.ng2STCssConfiguration.setCaretDesc("fa fa-caret-down");
  }
}
```

If you dont't want to use the global configuration for CSS, this is the HTML template used:

```xml
<table [ngClass]="tableClasses">
  <thead>
    <tr>
      <th *ngFor="let c of columns">
        <p *ngIf="canSort(c)"><!-- Displayed if data can be sorted by this column -->

          <a href (click)="sortByColumn($event, c)">{{c.title}}</a>

          <a
            href
            *ngIf="currentSort.target == c.target && currentSort.asc"
            (click)="sortByColumn($event, c)"
          >
            <i [ngClass]="caretAscClasses"></i>
          </a>

          <a
            href
            *ngIf="currentSort.target == c.target && !currentSort.asc"
            (click)="sortByColumn($event, c)"
          >
            <i [ngClass]="caretDescClasses"></i>
          </a>
        </p>

        <p *ngIf="!canSort(c)"><!-- Displayed if data cannot be sorted by this column  -->
          {{c.title}}
        </p>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let d of data;">
      <td *ngFor="let c of columns;" [innerHtml]="getValue(d, c)">
      </td>
    </tr>
  </tbody>
</table>
```

### Data display

country-manage.component.ts

```typescript
import { Component } from '@angular/core';
import { Ng2STFactory, Ng2ST, Ng2STCssConfiguration, ActionsColumn, Sort } from 'ng2-simple-table';

@Component({
  selector: "country-manage",
  templateUrl: "./manage.html"
})
export class CountryManageComponent {

  data:Array<any>= [
    { id: 1, name: "Argentine" },
    { id: 2, name: "Brazil" },
    { id: 3, name: "China" },
    { id: 4, name: "England" },
    { id: 5, name: "Spain" },
    { id: 6, name: "United States" }
  ];

  //title= Column title.
  //target= Property name to display.
  cols:Array<Column>= [
    { title: "ID", target: "id" },
    { title: "Name", target: "name" }
  ];

  //Optional
  actions:ActionsColumn= {
    title: "Actions",
    displayOnLeft: true,
    forEachRow:[{callBack: (data:any) => {

      let link:string= this.linkEdit(data.id);
      return '<a href="' + link + '"><i class="fa fa-pencil" title="edit"></i></a>';
    }}]
  };

  /** Optional
  * Sort strategy.
  * "asc" and "desc" are functions to use with Array.sort();
  *
  * asc: It will be used when sorting the data in ascending order.
  * desc: It will be used when sorting the data in descending order;
  */
  sortByNameStrategy:Sort= {
    asc: (arg0:any, arg1:any) => {

      if(arg0 == arg1)
        return 0;

      if(arg0 > arg1)
        return 1;

      return -1;
    },

    desc: (arg0:any, arg1:any) => {

      if(arg0 == arg1)
        return 0;

      if(arg0 < arg1)
        return 1;

      return -1;
    }
  };

  constructor() {

    let table= Ng2STFactory.basic(this.data, this.cols);

    //This will set the column "name" to be used for sorting using the given strategy.
    table.addSortStrategy("name", this.sortByNameStrategy);

    //This will set the actions column. If it is not used, the column will not be displayed.
    table.setActionsColumn(this.actions);
    this.tableSettings= table;
  }

  private linkEdit(countryId:number): string {
    return "/country/form/" + countryId;
  }

```

manage.html

```xml
<ng2-simple-table [settings]="tableSettings"></ng2-simple-table>
```

## TODO
  - Tests.
  - Filter.
  - Pagination.
  - Show/Hide columns.

## License

MIT © [Alva Damián](mailto:alva.damian@yahoo.com.ar)
