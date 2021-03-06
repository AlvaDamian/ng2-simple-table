import { Ng2ST, Ng2STFactory } from '../';
import { Column, Sort, Filter } from '../interfaces';


describe('Ng2ST tests', () => {

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
      { id: 1, title: 'ID', target: 'id' },
      { id: 2, title: 'Name', target: 'name' }
    );

    initialPage = 1;
    perPage = 4;
    ng2STInstance = Ng2STFactory.createAutonomous(data, columns);
  });

  it('Should get the correct value from object in current row', () => {

    let name0 = ARGENTINE;
    let name1 = BRAZIL;
    let name2 = SPAIN;
    let column: Column = { id: 1, title: 'Name', target: 'name' };

    expect(ng2STInstance.getValue({ name: name0 }, column)).toEqual(name0);
    expect(ng2STInstance.getValue({ name: name1 }, column)).toEqual(name1);

    expect(ng2STInstance.getValue({ name: name2 }, column)).not.toEqual(name0);
    expect(ng2STInstance.getValue({ name: name2 }, column)).not.toEqual(name1);
  });

  it('Should return an empty string when the column does not exists', (done) => {

    let column: Column = { id: 1, title: 'example', target: 'unknown' };

    expect(ng2STInstance.getValue({}, column)).toEqual('');
    done();
  });

  it ('Should return the value for a nested object', (done) => {

    let column: Column = { id: 1, title: 'Name', target: 'nested.id' };
    let object= { nested: { id : 7 }};

    expect(ng2STInstance.getValue(object, column)).toEqual(7);

    done();
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

  it('Should not add a new sort strategy if already' +
     ' exists one and we don\'t want to replace it',
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

  it('Should return NULL when there is no sort strategy for a given target',
    () => {

    let temp = ng2STInstance.getSortStrategy(unknownTarget);

    expect(temp).toBeNull();
  });

  it('Should sort data', (done) => {

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
      done();
    });
  });

  it('Should set pagination', () => {

    ng2STInstance.addPagination(initialPage, perPage);

    expect(ng2STInstance.getPage()).toEqual(initialPage);
  });

  it('Should return the number of available pages', (done) => {

    ng2STInstance.addPagination(initialPage, perPage);
    let total = ng2STInstance.getNumberOfPages();

    expect(total).toEqual(2);
    done();
  });

  it('Should return data for the current page and not more or less', (done) => {

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
          done();
        });
      });
    });


  });

  it('Should return data for the current page when ' +
     ' a sorting strategy has been applied - Part 1',
     (done) => {

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
      done();
    });
  });

  it('Should return data for the current page when ' +
    ' a sorting strategy has been applied - Part 2',
    (done) => {

      ng2STInstance.addSortStrategy(sortTarget, sort);
      ng2STInstance.addPagination(initialPage, perPage);
      ng2STInstance.sort(sortTarget, false);
      ng2STInstance.setPage(2);

      ng2STInstance
      .getData()
      .then(d => {

        expect(d.length).toEqual(2);

        expect(d[0]).toEqual({ id: 2, name: BRAZIL });
        expect(d[1]).toEqual({ id: 1, name: ARGENTINE });
        done();
      });
  });

  it('Should add a default filter strategy', () => {

    ng2STInstance.addFilter("name");
    expect(
      ng2STInstance
      .hasFilter({ id: 1, title: "Name", target: "name" })
    ).toBeTruthy();
  });

  it("Should add an specyfic filter strategy", () => {

    let filter: Filter=
      (value, input) => {

        let v = String(value).toLowerCase();
        let i = String(input).toLowerCase();

        return v.indexOf(i) !== -1;
    };

    ng2STInstance.addFilter("name", filter);

    expect(ng2STInstance.hasFilter({ id: 1, title: "Name", target: "name" })).toBeTruthy();
  });

  it("Should filter data", (done) => {

    let filter: Filter=
      (value, input) => {

        let v = String(value).toLowerCase();
        let i = String(input).toLowerCase();

        return v.indexOf(i) !== -1;

    };

    ng2STInstance.addFilter("name", filter);
    ng2STInstance.applyFilter("name", "Arg");

    ng2STInstance
    .getData()
    .then(d => {
      expect(d.length).toEqual(1);
      expect(d[0]).toEqual({ id: 1, name: ARGENTINE });
      done();
    });
  });
});
