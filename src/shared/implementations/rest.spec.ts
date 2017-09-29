import { Ng2ST, Ng2STFactory } from '../';
import { Column, RESTSort, Sort } from '../interfaces';


describe('Ng2STREST tests', () => {

  const ACTIONS_ON_LEFT_SIDE = true;
  const ACTIONS_INITIAL_SIDE = ACTIONS_ON_LEFT_SIDE;

  const ACTIONS_INITIAL_TITLE = 'Actions';

  let url: string;
  let columns: Array<Column>;
  let ng2STInstance: Ng2ST<Sort | RESTSort>;
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

  beforeEach((done) => {

    url = 'https://restcountries.eu/rest/v2/' +
    'all?fields=name;region;population;capital;alpha3Code';

    columns = new Array<Column>(
      { id: 1, title: 'Name', target: 'name' },
      { id: 2, title: 'Region', target:  'region' },
      { id: 3, title: 'Population', target: 'population' },
      { id: 4, title: 'Capital', target: 'capital' }
    );


    initialPage = 1;
    perPage = 15;
    ng2STInstance = Ng2STFactory.createREST(url, columns);

    done();
  });

  it('Should add a new sort strategy', (done) => {

    let hasSort = ng2STInstance.hasSortStrategy(sortTarget);
    expect(hasSort).toBeFalsy();

    ng2STInstance.addSortStrategy(sortTarget, sort);
    hasSort = ng2STInstance.hasSortStrategy(sortTarget);

    expect(hasSort).toBeTruthy();
    done();
  });

  it('Should replace an existing sort strategy', (done) => {

    ng2STInstance.addSortStrategy(sortTarget, sort);


    ng2STInstance.addSortStrategy(sortTarget, anotherSort);
    let result = ng2STInstance.getSortStrategy(sortTarget);

    expect(result).toBeTruthy();
    expect(result).not.toBe(sort);
    expect(result).toBe(anotherSort);
    done();
  });

  it('Should not add a new sort strategy if ' +
    ' already exists one and we don\'t want to replace it',
    (done) => {

    ng2STInstance.addSortStrategy(sortTarget, sort);
    ng2STInstance.addSortStrategy(sortTarget, anotherSort, false);

    let result = ng2STInstance.getSortStrategy(sortTarget);

    expect(result).toBe(sort);
    expect(result).not.toBe(anotherSort);
    done();
  });

  it('Should return the expected sort strategy', (done) => {

    ng2STInstance.addSortStrategy(sortTarget, sort);

    expect(ng2STInstance.getSortStrategy(sortTarget)).toBe(sort);
    done();
  });

  it('Should return NULL when there is no sort strategy for a given target',
    (done) => {

    let temp = ng2STInstance.getSortStrategy(unknownTarget);

    expect(temp).toBeNull();
    done();
  });

  it('Should set pagination', (done) => {

    ng2STInstance.addPagination(initialPage, perPage);

    expect(ng2STInstance.getPage()).toEqual(initialPage);
    done();
  });

  it('Should return the number of available pages', (done) => {

    ng2STInstance.addPagination(initialPage, perPage);

    ng2STInstance
    .getData()
    .then(d => {
      let total = ng2STInstance.getNumberOfPages();

      expect(total).toEqual(17);
      done();
    });
  });
});
