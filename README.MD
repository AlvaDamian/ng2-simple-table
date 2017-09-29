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
    ...
    Ng2SimpleTableModule.forRoot()
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
    *
    * This will be merged with 'ng2-simple-table'.
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
    * See the next HTML code to know can be set.
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


### Data display

All examples uses this HTML. @maxPages is optional and, if setted, it will be used
as a delimiter for the number of buttons in the pagination section.

```xml
<div>
  <ng2-simple-table [maxPages]="10" [settings]="tableSettings"></ng2-simple-table>
</div>

<div>
  <ng2-simple-table [maxPages]="10" [settings]="tableSettingsRest"></ng2-simple-table>
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
    { id: 1, title: "ID", target: "alpha3Code" },
    { id: 2, title: "Name", target: "name" },
    { id: 3, title: "Region", target: "region" },
    { id: 4, title: "Population", target: "population" },
    { id: 5, title: "Capital", target: "capital" }
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
* strategy for that column treating each value as a string.
*
* This approach may not be used for all implementations of Ng2ST.
*/
...
columns:Array<Column>= [
  ...
  { id: 1, title: "Name", target: "name", sort: true },
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
let tableRest= Ng2STFactory.createREST(url, columns);
tableRest.addSortStrategy("name", sortForRest);
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
  { id: 1, title: "Name", target: "name", filter: true },
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

Add a column that has to be displayed with a custom value and not a primitive. An example
of this type of column is one that has actions for each row.

Primitives are strings, numbers, boolean, etc.. Custom are buttons, links, images, etc.

For this example we will use this class that uses @Component from angular and implements
Ng2STComponent.

```typescript
import { Component, Input } from '@angular/core';
import { Ng2STComponent } from 'ng2-simple-table';

/**
* This class represents a link that uses FontAwesome icons.
*/
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

  /**
  * Events to wich we want to subscribe.
  *
  * name: Name of the property of the class that represents an event.
  * handler: Handler to subscribe to the event.
  */
  public events(): Array<{ name: string, handler: (...args: any[]) => void }> {
    return new Array<{name: string, handler: (...args: any[]) => void}>();
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
  { id: 1, title: "Actions", target: "id", filter: true,
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
    id: 1,
    title: "Actions",
    target: "id",
    isOptions: true,
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

### Set unsorted and unfilter column

Set the @isOptions property on a column definition to TRUE so that column cannot be
sorted or filtered.

```typescript

/**
* This will display a column with a link that changes route for each row.
*/
...
columns:Array<Column>= [
  {
    id: 1,
    title: "Actions",
    target: "id",
    isOptions: true,
    customValue: (value, fullObject) =>
                FALinkComponent.create(this.editRoute(value), "fa fa-pencil")
  },
];
```

### Display the value of a nested object.

Lets suppose we have this data.

```json
{
  "product": [
    { "id": 1, "name": "Candy", "category": { "id": 1, "name": "Sweets" } },
    { "id": 2, "name": "Milk", "category": { "id": 2, "name": "Dairy Products" } },
    { "id": 3, "name": "Cheese", "category": { "id": 2, "name": "Dairy Products" } }
  ]
}
```

We can display nested objects values using dot notation in the @target property
of a column.

```typescript
...
columns:Array<Column>= [
  { id: 1, title: "Product ID", target: "id" },
  { id: 2, title: "Product Name", target: "name" },
  { id: 3, title: "Category ID", target: "category.id" },
  { id: 4, title: "Category Name", target: "category.name" },
];
```

### Complex column titles

Using the same json from the above example. We want to display data like this:

<table>
  <thead>
    <tr>
      <th colspan="2">Product Info</th>
      <th colspan="2">Category Info</th>
    </tr>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>ID</th>
      <th>Name</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Candy</td>
      <td>1</td>
      <td>Sweets</td>
    </tr>
    <tr>
      <td>1</td>
      <td>Milk</td>
      <td>2</td>
      <td>Dairy Products</td>
    </tr>
    <tr>
      <td>1</td>
      <td>Cheese</td>
      <td>2</td>
      <td>Dairy Products</td>
    </tr>
  </tbody>
</table>

For this, in the column definition, @subColumns need to be set.

```typescript

/**
* rowspan: How much rows that definition should use.
* colspan: How much columns that definition should use.
*
* Rememeber to use colspan and rowspan.
*/
...
columns:Array<Column>= [
  {
    id: 7,
    title: "Actions",
    target: "id",
    isOptions: true,
    rowspan: 2
  }
  {
    id: 1,
    title: "Product Info",
    target: "",
    colspan: 2,
    subColumns: [
      { id: 2, title: "Product ID", target: "id" },
      { id: 3, title: "Product Name", target: "name" }
    ]
  },
  {
    id: 4,
    title: "Category Info",
    target: "category",
    colspan: 2,
    subColumns: [
      { id: 5, title: "Category ID", target: "category.id" },
      { id: 6, title: "Category Name", target: "category.name" }
    ]
  }
];
```

Filter can be set to columns that are leafs of the tree, but not on roots.

Sort strategies can be set to any column root but @addSortStrategy must be used.
For example, sort by category column:

```typescript

/**
* First sort by id, then by name. This sort strategy is dumb, but it will suffice as an
* example.
*/
let byNameAsc= (arg0, arg1) => arg0 == arg1 ? 0 : (arg0 > arg1 ? 1 : -1)
let byNameDesc= (arg0, arg1) => arg0 == arg1 ? 0 : (arg0 < arg1 ? 1 : -1)

/**
* Since @target "category" is an object, arg0 and arg1 are objects of that type.
*/
let sortStrategy:Sort = {

  asc: (arg0, arg1) => arg0 == arg1 ? byNameAsc(arg0, arg1) : (arg0.id > arg1.id ? 1 : -1)
  , desc: (arg0, arg1) => arg0 == arg1 ? byNameDesc(arg0, arg1) : (arg0.id < arg1.id ? 1 : -1)
};

ng2STInstance.addSortStrategy("category", sortStrategy);
```

### Change column title

Using @changeTitle(columnId: number, newTitle: string) from the Ng2ST instance:

```typescript
...
columns:Array<Column>= [
  {
    id: 7,
    title: "Actions",
    target: "id",
    isOptions: true,
    rowspan: 2
  }
  {
    id: 1,
    title: "Product Info",
    target: "",
    colspan: 2,
    subColumns: [
      { id: 2, title: "Product ID", target: "id" },
      { id: 3, title: "Product Name", target: "name" }
    ]
  },
  {
    id: 4,
    title: "Category Info",
    target: "category",
    colspan: 2,
    subColumns: [
      { id: 5, title: "Category ID", target: "category.id" },
      { id: 6, title: "Category Name", target: "category.name" }
    ]
  }
];
...

// When some event occurs and language is changed.
// If now the language is spanish.
...
//Sets the new title to one column.
instance.changeTitle(1, "Información del Producto");
instance.changeTitle(4, "Categoría");
instance.changeTitle(7, "Acciones");

//Sets the new title to a set of columns.
instance.changeTitle([2, 5], "Código");
instance.changeTitle([3, 6], "Nombre");
...

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
