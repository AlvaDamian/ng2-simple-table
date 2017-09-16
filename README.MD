# ng2-simple-table

# IMPORTANT

Many break changes are expected until version 1.0.

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


    /**
    * If pagination is added, <tfoot /> will be added to the column when there is more than 1 page.
    *
    * See the next HTML code to know how it will be set.
    */

    // Adds classes to the "<ul/>" tag.
    this.ng2STCssConfiguration.setPagination("pagination mt-2 justify-content-center");

    // Adds classes to each "<li/>" tag.
    this.ng2STCssConfiguration.setPaginationItem("page-item");

    // Adds classes to each "<a/>" tag.
    this.ng2STCssConfiguration.setPaginationLink("page-link");

    // Combines this with the above classes to the active page "<a/>" tag.
    this.ng2STCssConfiguration.setPaginationActiveItem("active");
  }
}
```

If you dont't want to use the global configuration for CSS, this is the HTML template used:

```xml
<table [ngClass]="tableClasses">
  <thead>
    <tr>
      <th *ngFor="let c of columns">
        <p *ngIf="canSort(c)">
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

        <p *ngIf="!canSort(c)">
          {{c.title}}
        </p>
      </th>
    </tr>
    </thead>
    <tbody>
      <tr *ngFor="let d of data;">
        <td *ngFor="let c of columns;"
        [innerHtml]="getValue(d, c)">
        </td>
      </tr>
  </tbody>

  <tfoot *ngIf="numberOfPages > 1">
    <tr>
      <td [attr.colspan]="columns.length">
        <nav>
          <ul [ngClass]="paginationClass">
            <li [ngClass]="paginationItemClass">
              <a
                href
                [ngClass]="paginationLinkClass"
                (click)="previousPage($event)"
              >
                <span>&laquo;</span>
              </a>
            </li>

            <li
              *ngFor="let i of numberOfPagesRange"
              [ngClass]="i != currentPage ? paginationItemClass : paginationActiveItemClass"
            >
              <a
                href
                [ngClass]="paginationLinkClass"
                (click)="changePage($event, i)">

                {{ i }}
              </a>
            </li>

            <li [ngClass]="paginationItemClass">
              <a
                href
                [ngClass]="paginationLinkClass"
                (click)="nextPage($event)"
              >
                <span>&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </td>
    </tr>
  </tfoot>
</table>
```

### Data display

country-manage.component.ts

```typescript
import { Component } from '@angular/core';
import { Ng2STFactory, Ng2ST, ActionsColumn, Sort } from 'ng2-simple-table';

@Component({
  selector: "country-manage",
  templateUrl: "./manage.html"
})
export class CountryManageComponent {

  data:Array<any>= [
    { id: 1, name: "Argentine", flag: "http://flags.fmcdn.net/data/flags/w580/ar.png" },
    { id: 2, name: "Brazil", flag: "http://flags.fmcdn.net/data/flags/w580/br.png" },
    { id: 3, name: "China", flag: "http://flags.fmcdn.net/data/flags/w580/cn.png" },
    { id: 4, name: "England", flag: "http://flags.fmcdn.net/data/flags/w580/gb.png" },
    { id: 5, name: "Spain", flag: "http://flags.fmcdn.net/data/flags/w580/es.png" },
    { id: 6, name: "United States", flag: "http://flags.fmcdn.net/data/flags/w580/us.png" }
  ];

  /** title: Column title.
  *   target: Property name to display.
  *   customDisplay: Custom value to display. It will be a function that accepts the value
  *                  for the column and the fullObject; returns "any".
  */
  cols:Array<Column>= [
    { title: "ID", target: "id" },
    { title: "Name", target: "name" }
    { title: "Flag", target: "flag",
    customDisplay: (value, fullObject) =>
    "<img src=\"" + value + "\" title=\"" + fullObject.name + "\" />" }
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
  * "asc" and "desc" are functions to be used with Array.sort();
  *
  * asc: It will be used when sorting the data in ascending order.
  * desc: It will be used when sorting the data in descending order;
  */
  sortByNameStrategy:Sort= {
    asc: (arg0:any, arg1:any) => arg0 == arg1 ? 0 : (arg0 >= arg1 ? 1 : -1)
    ,
    desc: (arg0:any, arg1:any) => arg0 == arg1 ? 0 : (arg0 <= arg1 ? 1 : -1)
  };

  constructor() {

    let table= Ng2STFactory.basic(this.data, this.cols);

    //This will set the column "name" to be used for sorting using the given strategy.
    table.addSortStrategy("name", this.sortByNameStrategy);

    //This will set the actions column. If it is not used, the column will not be displayed.
    table.setActionsColumn(this.actions);

    //This will display data in pages of 4 elements.
    //It is not used, data will be displayed in a single page.
    table.addPagination(1, 4);

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
  - Show/Hide columns.

## License

MIT © [Alva Damián](mailto:alva.damian@yahoo.com.ar)
