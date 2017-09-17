import { Ng2ST, Ng2STFactory } from '../';
import { ActionsColumn, Column, Sort } from '../interfaces';


describe('Ng2SimpleTable tests', () => {

  const ARGENTINE = 'Argentine';
  const BRAZIL = 'Brazil';
  const CHINA = 'China';
  const ENGLAND = 'England';
  const SPAIN = 'Spain';
  const UNITED_STATES = 'United States';

  const ACTIONS_ON_LEFT_SIDE = true;
  const ACTIONS_INITIAL_SIDE = ACTIONS_ON_LEFT_SIDE;

  const ACTIONS_INITIAL_TITLE = 'Actions';

  let data: Array<any>;
  let columns: Array<Column>;
  let ng2STInstance: Ng2ST<Sort>;
  let actionsColumn: ActionsColumn;
  let initialPage: number;
  let perPage: number;

  let sortTarget = 'name';
  let unknownTarget = 'target not used';

  let sort: Sort = {
    asc: (arg0: any, arg1: any) => arg0 === arg1 ? 0 : (arg0 >= arg1 ? 1 : -1)
    ,
    desc: (arg0: any, arg1: any) => arg0 === arg1 ? 0 : (arg0 <= arg1 ? 1 : -1)
  };

  let anotherSort: Sort = {

    asc: (arg0: any, arg1: any) => arg0 === arg1 ? -1 : 1
    ,

    desc: (arg0: any, arg1: any) => arg0 === arg1 ? 1 : -1
  };

  beforeEach(() => {

    data = new Array<any>(
      { id: 1, name: ARGENTINE },
      { id: 2, name: BRAZIL },
      { id: 3, name: CHINA },
      { id: 4, name: ENGLAND },
      { id: 5, name: SPAIN },
      { id: 6, name: UNITED_STATES }
    );

    columns = new Array<Column>(
      { title: 'ID', target: 'id' },
      { title: 'Name', target: 'name' }
    );

    actionsColumn = {
      title: ACTIONS_INITIAL_TITLE,
      displayOnLeft: ACTIONS_ON_LEFT_SIDE
    };

    initialPage = 1;
    perPage = 4;
    ng2STInstance = Ng2STFactory.basic(data, columns);
  });

  it('Should get the correct value from object in current row', () => {

    let name0 = ARGENTINE;
    let name1 = BRAZIL;
    let name2 = SPAIN;
    let column: Column = { title: 'Name', target: 'name' };

    expect(ng2STInstance.getValue({ name: name0 }, column)).toBe(name0);
    expect(ng2STInstance.getValue({ name: name1 }, column)).toBe(name1);

    expect(ng2STInstance.getValue({ name: name2 }, column)).not.toBe(name0);
    expect(ng2STInstance.getValue({ name: name2 }, column)).not.toBe(name1);

    expect(ng2STInstance.getValue({ }, column)).toBeNull();
  });

  it('Should set actions columns', () => {

    ng2STInstance.setActionsColumn(actionsColumn);

    let temp: ActionsColumn = ng2STInstance.getActionsColumn();

    expect(temp).toBeDefined();
    expect(temp.title).toBeDefined();
    expect(temp.displayOnLeft).toBeDefined();

    expect(temp).toBe(actionsColumn);
    expect(temp.title).toBe(ACTIONS_INITIAL_TITLE);
    expect(temp.displayOnLeft).toBe(ACTIONS_INITIAL_SIDE);
  });

  it('Should not set actions column if a null parameter is given', () => {

    ng2STInstance.setActionsColumn(null);

    let temp: ActionsColumn = ng2STInstance.getActionsColumn();
    let columnsQuantity = ng2STInstance.getColumns().length;

    expect(temp).toBeNull();
    expect(columns.length).toEqual(columnsQuantity);
  });

  it('Should add a new column if actions are setted', () => {

    let initialColumnsQuantity = columns.length;
    ng2STInstance.setActionsColumn(actionsColumn);

    let currentColumnsQuantity = ng2STInstance.getColumns().length;

    expect(initialColumnsQuantity + 1).toBe(currentColumnsQuantity);
  });

  it('Should add a new sort strategy', () => {

    let hasSort = ng2STInstance.hasSortStrategy(sortTarget);
    expect(hasSort).toBeFalsy();

    ng2STInstance.addSortStrategy(sortTarget, sort);
    hasSort = ng2STInstance.hasSortStrategy(sortTarget);

    expect(hasSort).toBeTruthy();
  });

  it('Should replace an existing sort strategy', () => {

    ng2STInstance.addSortStrategy(sortTarget, sort);


    ng2STInstance.addSortStrategy(sortTarget, anotherSort);
    let result= ng2STInstance.getSortStrategy(sortTarget);

    expect(result).toBeTruthy();
    expect(result).not.toBe(sort);
    expect(result).toBe(anotherSort);
  });

  it('Should not add a new sort strategy if already exists one and we don\'t want to replace it',
  () => {

    ng2STInstance.addSortStrategy(sortTarget, sort);
    ng2STInstance.addSortStrategy(sortTarget, anotherSort, false);

    let result= ng2STInstance.getSortStrategy(sortTarget);

    expect(result).toBe(sort);
    expect(result).not.toBe(anotherSort);
  });

  it('Should return the expected sort strategy', () => {

    ng2STInstance.addSortStrategy(sortTarget, sort);

    expect(ng2STInstance.getSortStrategy(sortTarget)).toBe(sort);
  });

  it('Should return NULL when there is no sort strategy for a given target', () => {

    let temp = ng2STInstance.getSortStrategy(unknownTarget);

    expect(temp).toBeNull();
  });

  it('Should sort data', () => {

    ng2STInstance.addSortStrategy(sortTarget, sort);
    ng2STInstance.sort(sortTarget, false);

    ng2STInstance
    .getData()
    .then(d => {

      let expected = new Array<any>(
        { id: 6, name: UNITED_STATES },
        { id: 5, name: SPAIN },
        { id: 4, name: ENGLAND },
        { id: 3, name: CHINA },
        { id: 2, name: BRAZIL },
        { id: 1, name: ARGENTINE }
      );

      expect(d).toEqual(expected);
    });
  });

  it('Should set pagination', () => {

    ng2STInstance.addPagination(initialPage, perPage);

    expect(ng2STInstance.getPage()).toEqual(initialPage);
  });

  it('Should return the number of available pages', () => {

    ng2STInstance.addPagination(initialPage, perPage);
    let total = ng2STInstance.getNumberOfPages();

    expect(total).toEqual(2);
  });

  it('Should return data for the current page and not more or less', () => {

    ng2STInstance.addPagination(initialPage, perPage);
    ng2STInstance
    .getData()
    .then(d => {

      expect(d.length).toEqual(perPage);

      expect(d[0]).toEqual({ id: 1, name: ARGENTINE });
      expect(d[1]).toEqual({ id: 2, name: BRAZIL });
      expect(d[2]).toEqual({ id: 3, name: CHINA });
      expect(d[3]).toEqual({ id: 4, name: ENGLAND });

      ng2STInstance.setPage(2);

      ng2STInstance
      .getData()
      .then(d2 => {

        expect(d2.length).toEqual(2);

        expect(d2[0]).toEqual({ id: 5, name: SPAIN });
        expect(d2[1]).toEqual({ id: 6, name: UNITED_STATES });

        ng2STInstance.setPage(3);

        ng2STInstance
        .getData()
        .then(d3 => {
          expect(d3.length).toEqual(0);
        });
      });
    });
  });

  it('Should return data for the current page when a sorting strategy has been applied', () => {

    ng2STInstance.addSortStrategy(sortTarget, sort);
    ng2STInstance.addPagination(initialPage, perPage);
    ng2STInstance.sort(sortTarget, false);

    ng2STInstance
    .getData()
    .then(d => {

      expect(d.length).toEqual(perPage);

      expect(d[0]).toEqual({ id: 6, name: UNITED_STATES });
      expect(d[1]).toEqual({ id: 5, name: SPAIN });
      expect(d[2]).toEqual({ id: 4, name: ENGLAND });
      expect(d[3]).toEqual({ id: 3, name: CHINA });

      ng2STInstance.setPage(2);

      ng2STInstance
      .getData()
      .then(d2 => {

        expect(d2.length).toEqual(2);

        expect(d2[0]).toEqual({ id: 2, name: BRAZIL });
        expect(d2[1]).toEqual({ id: 1, name: ARGENTINE });
      });
    });
  });
});
