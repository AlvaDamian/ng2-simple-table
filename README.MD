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

    <tr *ngIf="data.length == 0">
      <td [attr.colspan]="columns.length">
        {{ loading ? "Loading..." : "There is no data to display." }}
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

All examples uses this HTML

```xml
<div>
  <ng2-simple-table [settings]="tableSettings"></ng2-simple-table>
</div>

<div>
  <ng2-simple-table [settings]="tableSettingsRest"></ng2-simple-table>
</div>
```

#### Basic implementation

This is the most basic implementation:
 - No filters.
 - No sort.
 - No pagination.
 - No custom columns.

```typescript
import { Component } from '@angular/core';
import { Ng2STFactory, Ng2ST, Sort, RESTSort } from 'ng2-simple-table';

@Component({
  .....
})
export class YourClassName {

  columns:Array<Column>= [
    { title: "ID", target: "alpha3Code" },
    { title: "Name", target: "name" },
    { title: "Region", target: "region" },
    { title: "Population", target: "population" },
    { title: "Capital", target: "capital" }
  ];

  tableSettings: Ng2ST<Sort>;
  tableSettingsRest: Ng2ST<RESTSort>;

  constructor() {


    let data= [/* some hardcoded data */];
    let url= "https://restcountries.eu/rest/v2/" +
    "all?fields=name;region;population;capital;alpha3Code";

    this.tableSettings= Ng2STFactory.createAutonomous(data, this.columns);
    this.tableSettingsRest= Ng2STFactory.createREST(url, this.columns);
  }
}
```

#### Add sort strategies

There are two forms to implement sorting for a column:
 - From column definition.
 - Using "addSortStrategy" from the object created by the factory.

```typescript
/*
* From column definition
*
* Add "sort: true" to a column that can be sorted. This will add a default
* strategy for that column.
*
* This approach may not be used for all implementations of Ng2ST.
*/
...
columns:Array<Column>= [
  ...
  { title: "Name", target: "name", sort: true },
  ...
];
...

...
/*
* Using "addSortStrategy"
*
* Add a custom sort strategy to the column.
*/
...
let sortForAutonomous:Sort= {
  asc: (arg0, arg1) => arg0 === arg1 ? 0 (arg0 > arg1 ? 1 : -1),
  desc: (arg0, arg1) => arg0 === arg1 ? 0 (arg0 < arg1 ? 1 : -1)
};

let sortForRest:RESTSort= {
  asc: "sort=name_asc",
  desc: "sort=name_desc"
}

//Autonomous table
let table= Ng2STFactory.createAutonomous(data, columns);

//add a default sort strategy to target="name"
table.addSortStrategy("name");

//add a custom sort strategy to target="name"
table.addSortStrategy("name", sortForAutonomous);

//add a default sort strategy to an Array of targets
table.addSortStrategy(["name", "population"]);

//add a custom sort strategy to an Array of targets
table.addSortStrategy(["name", "population"], sortForAutonomous);

//REST table
let tableSort= Ng2STFactory.createREST(url, columns);
tableSort.addSortStrategy("name", sortForRest);
...

```

#### Add pagination

Use "addPagination(initialPage, perPage)" to implement pagination.

```typescrit
...
let table= Ng2STFactory.createAutonomous(data, columns);
table.addPagination(1, 15);

/**
* For REST there are two options
*
* First: We fetch all data and it has to be paged in memory.
* Second: The server supports pagination for the given url. So, we use query params.
*/

// First approach
let tableRest= Ng2STFactory.createREST(url, columns);
tableRest.addPagintion(1, 15);

//Second approach
/**
* @param url
* @param columns
* @param dataResponseParam Property of the response that holds data.
* @param pageRequestParam Param to add in the query string with the page value.
* @param perPageRequestParam Param to add in the query string with the perPage value
* @param totalPagesResponseParam Property of the response that holds the total number
* of pages for the response.
*
* If pageRequestParam or perPageRequestParam is missing, the query string will not be modified.
*/
let tableRest= Ng2STFactory.createREST(url, columns, "payload", "page", "perPage", "totalPages");
tableRest.addPagination(1, 15);
...
```

#### Add filter
For the moment filter functionality works in memory.

```typescript
/**
* From column definition.
*
* This will treat the value as a string.
*
* This approach may not be used for all implementations of Ng2ST.
*/
...
columns:Array<Column>= [
  ...
  { title: "Name", target: "name", filter: true },
  ...
];
...

...
/**
* Using "addFilter"
*/

//value= The value of the object for the given target. input= User input on the filter.
let customFilter:Filter= {
  filter: (value:any, input:any) => {

    let v = (value as string).toLowerCase();
    let i = (input as string).toLowerCase();

    return v.indexOf(i) !== -1;
  }
}

let table= Ng2STFactory.createAutonomoues(data, columns);

//Adds a default filter for the column with target="name"
table.addFilter("name");

//Adds a custom filter for the column with target="name"
table.addFilter("name", customFilter);
...
```

#### Column with custom value

Add columns that has to be displayed with a custom value and not a primitive. And example
of this type of column is one that has actions for each row.

Primitives are strings, numbers, boolean, etc.. Custom are buttons, links, images, etc.

For this example we will use this class

```typescript
import { Component, Input } from '@angular/core';
import { Ng2STComponent } from 'ng2-simple-table';

@Component({
  selector: 'fa-link',
  template: '<a href [routerLink]="link"><i [ngClass]="classes"></i></a>'
})
export class FALinkComponent implements Ng2STComponent {

  classes: string;
  link: string;

  constructor() { }

  /**
  * Return the type of this class. Only types should be returned.
  */
  public component() {
    return FALinkComponent;
  }

  /**
  * name: Name of a property of the class.
  * value: Value to assign to that property.
  */
  public inputs(): Array<{name: string, value: any}> {

    let ret= new Array<{name: string, value: any}>();

    ret.push({name: "link", value: this.link});
    ret.push({name: "classes", value: this.classes});

    return ret;
  }

  public static create(_link: string, _classes: string): FALinkComponent {

    let ret= new FALinkComponent();

    ret.link= _link;
    ret.classes= _classes;

    return ret;
  }
}
```

```typescript
...
/**
* Return a primitive
*/
columns:Array<Column>= [
  ...
  { title: "Actions", target: "id", filter: true,
  customValue: (value, fullObject) => value + " changed" },
  ...
];
...

/**
* Return an object that uses @Component from Angular2 and implements Ng2STComponent
*/
...
columns:Array<Column>= [
  {
    title: "Actions",
    target: "id",
    filter: true,
    customValue: (value, fullObject) =>
                FALinkComponent.create(this.editRoute(value), "fa fa-pencil")
  },
];
...

/**
* customValue can return an Array. Each value will be displayed next to the other.
* For example: Return an Array<Ng2STRComponent> and each element will be next to the other.
*/
```

### Implement your own table logic

Ng2ST is now an interface. Implement this with your own code and pass it as parameter
to the "ng2-simple-table" tag.

## TODO
  - Tests.
  - Filter for REST with query params.
  - Show/Hide columns.

## License

MIT © [Alva Damián](mailto:alva.damian@yahoo.com.ar)
