import { Ng2ST, Ng2STFactory } from '../';
import { ActionsColumn, Column, RESTSort, Sort } from '../interfaces';


describe('Ng2STREST tests', () => {

  const ACTIONS_ON_LEFT_SIDE = true;
  const ACTIONS_INITIAL_SIDE = ACTIONS_ON_LEFT_SIDE;

  const ACTIONS_INITIAL_TITLE = 'Actions';

  let url: string;
  let columns: Array<Column>;
  let ng2STInstance: Ng2ST<Sort | RESTSort>;
  let actionsColumn: ActionsColumn;
  let initialPage: number;
  let perPage: number;

  let sortTarget = 'name';
  let unknownTarget = 'target not used';

  let sort: RESTSort = {
    asc: ''
    ,
    desc: ''
  };

  let anotherSort: RESTSort = {
    asc: ''
    ,
    desc: ''
  };

  beforeEach(() => {

    url = 'http://api.geonames.org/countryInfoJSON?username=demo';

    columns = new Array<Column>(
      { title: 'Name', target: 'name' },
      { title: 'Region', target:  'region' },
      { title: 'Population', target: 'population' },
      { title: 'Capital', target: 'capital' }
    );

    actionsColumn = {
      title: ACTIONS_INITIAL_TITLE,
      displayOnLeft: ACTIONS_ON_LEFT_SIDE
    };

    initialPage = 1;
    perPage = 4;
    ng2STInstance = Ng2STFactory.createREST(url, columns);
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
    let result = ng2STInstance.getSortStrategy(sortTarget);

    expect(result).toBeTruthy();
    expect(result).not.toBe(sort);
    expect(result).toBe(anotherSort);
  });

  it('Should not add a new sort strategy if already exists one and we don\'t want to replace it',
  () => {

    ng2STInstance.addSortStrategy(sortTarget, sort);
    ng2STInstance.addSortStrategy(sortTarget, anotherSort, false);

    let result = ng2STInstance.getSortStrategy(sortTarget);

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

  it('Should set pagination', () => {

    ng2STInstance.addPagination(initialPage, perPage);

    expect(ng2STInstance.getPage()).toEqual(initialPage);
  });

  it('Should return the number of available pages', () => {

    ng2STInstance.addPagination(initialPage, perPage);
    let total = ng2STInstance.getNumberOfPages();

    expect(total).toEqual(2);
  });
});
