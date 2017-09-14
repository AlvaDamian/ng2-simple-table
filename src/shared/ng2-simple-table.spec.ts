import { Ng2ST, Ng2STFactory } from './';
import { ActionsColumn, Column, ActionsColumnForEachRow, Sort } from './interfaces';


describe("Ng2SimpleTable tests", () => {

	const ARGENTINE= "Argentine";
	const BRAZIL= "Brazil";
	const CHINA= "China";
	const ENGLAND= "England";
	const SPAIN= "Spain";
	const UNITED_STATES= "United States";
	const UNDEFINED_NAME= "this string is not a used country name";

	const ACTIONS_ON_LEFT_SIDE= true;
	const ACTIONS_ON_RIGHT_SIDE= false;
	const ACTIONS_INITIAL_SIDE= ACTIONS_ON_LEFT_SIDE;

	const ACTIONS_INITIAL_TITLE= "Actions";
	const ACTIONS_INITIAL_FOR_EACH_ROW:[ActionsColumnForEachRow]= [{
		callBack: (d) => {return "test";}
	}];

  let data:Array<any>;
  let columns:Array<Column>;
  let ng2STInstance:Ng2ST;
  let tableClasses:string;
  let actionsColumn:ActionsColumn;

  let sortTarget= "name";
  let unknownTarget= "target not used";

  let sort:Sort= {
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
  }

  let anotherSort:Sort= {

  	asc: (arg0:any, arg1:any) => {
  		if(arg0 == arg1)
  			return 0;

  		if(arg0 != arg1)
  			return 1;

  		return -1;
  	},

  	desc: (arg0:any, arg1:any) => {

  		if(arg0 == arg1)
  			return 0;

  		if(arg0 == arg1)
  			return 1;

  		return -1;
  	}
  }

	beforeEach(() => {

		data= new Array<any>(
      { id: 1, name: ARGENTINE },
      { id: 2, name: BRAZIL },
      { id: 3, name: CHINA },
      { id: 4, name: ENGLAND },
      { id: 5, name: SPAIN },
      { id: 6, name: UNITED_STATES }
    );

    columns= new Array<Column>(
      { title: "ID", target: "id" },
      { title: "Name", target: "name" }
    );

    actionsColumn= {
    	title: ACTIONS_INITIAL_TITLE,
    	displayOnLeft: ACTIONS_ON_LEFT_SIDE
    };

    tableClasses= "table table-striped table-condensed table-bordered";

    ng2STInstance= Ng2STFactory.basic(data, columns);
	});

	it("Should add CSS classes", () => {

  	ng2STInstance.setTableClasses(tableClasses);

  	expect(ng2STInstance.getTableClasses()).toBe(tableClasses)
  });

  it("Should get the correct value from object in current row", () => {

  	let name0= ARGENTINE;
  	let name1= BRAZIL;
  	let name2= SPAIN;
  	let column:Column= { title: "Name", target: "name" };

  	expect(ng2STInstance.getValue({ name: name0 }, column)).toBe(name0);
  	expect(ng2STInstance.getValue({ name: name1 }, column)).toBe(name1);

  	expect(ng2STInstance.getValue({ name: name2 }, column)).not.toBe(name0);
  	expect(ng2STInstance.getValue({ name: name2 }, column)).not.toBe(name1);

  	expect(ng2STInstance.getValue({ }, column)).toBeNull();
  });

  it("Should set actions columns", () => {

  	ng2STInstance.setActionsColumn(actionsColumn);

  	let temp:ActionsColumn= ng2STInstance.getActionsColumn();

  	expect(temp).toBeDefined();
  	expect(temp.title).toBeDefined();
  	expect(temp.displayOnLeft).toBeDefined();

  	expect(temp).toBe(actionsColumn);
  	expect(temp.title).toBe(ACTIONS_INITIAL_TITLE);
  	expect(temp.displayOnLeft).toBe(ACTIONS_INITIAL_SIDE);
  });

  it("Should add a new column if actions are setted", () => {

  	let initialColumnsQuantity= columns.length;
  	ng2STInstance.setActionsColumn(actionsColumn);

  	let currentColumnsQuantity= ng2STInstance.getColumns().length;

  	expect(initialColumnsQuantity + 1).toBe(currentColumnsQuantity);
  });

  it("Should add a new sort strategy", () => {

  	let sortQuantity= ng2STInstance.getSortStrategies().size;
  	ng2STInstance.addSortStrategy(sortTarget, sort);
  	let sortNewQuantity= ng2STInstance.getSortStrategies().size;

  	expect(sortQuantity + 1).toBe(sortNewQuantity);
  });

  it("Should replace an existing sort strategy", () => {

  	ng2STInstance.addSortStrategy(sortTarget, sort);

  	let sortQuantity= ng2STInstance.getSortStrategies().size;
  	let result= ng2STInstance.addSortStrategy(sortTarget, anotherSort);
  	let newSortQuantity= ng2STInstance.getSortStrategies().size;

  	expect(result).toBeTruthy();
  	expect(sortQuantity).toBe(newSortQuantity);
  	expect(ng2STInstance.getSortStrategy(sortTarget)).toBe(anotherSort);
  });

  it("Should not add a new sort strategy if already exists one and we don't want to replace it",
  () => {

  	ng2STInstance.addSortStrategy(sortTarget, sort);

  	let sortQuantity= ng2STInstance.getSortStrategies().size;
  	let result= ng2STInstance.addSortStrategy(sortTarget, anotherSort, false);
  	let newSortQuantity= ng2STInstance.getSortStrategies().size;

  	expect(result).toBeFalsy();
  	expect(sortQuantity + 1).not.toBe(newSortQuantity);
  	expect(ng2STInstance.getSortStrategy(sortTarget)).not.toBe(anotherSort);
  });

  it("Should return the expected sort strategy", () => {

  	ng2STInstance.addSortStrategy(sortTarget, sort);

  	expect(ng2STInstance.getSortStrategy(sortTarget)).toBe(sort);
  });

  it("Should return NULL when there is no sort strategy for a given target", () => {

  	let temp= ng2STInstance.getSortStrategy(unknownTarget);

  	expect(temp).toBeNull();
  });

  it("Should sort data", () => {

  	ng2STInstance.addSortStrategy(sortTarget, sort);
  	let newData= ng2STInstance.sort(sortTarget, false);

  	let expectedData= new Array<any>(
      { id: 6, name: UNITED_STATES },
      { id: 5, name: SPAIN },
      { id: 4, name: ENGLAND },
      { id: 3, name: CHINA },
      { id: 2, name: BRAZIL },
      { id: 1, name: ARGENTINE }
    );;

  	expect(newData).toBeDefined();
  	expect(newData).toEqual(expectedData);
  });
})