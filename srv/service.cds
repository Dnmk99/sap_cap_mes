using{mesDb as mesDb} from '../db/entitySet';
service Data @(path: '/dataSet') { //create path 4 APIs
    //entity Data as projection on test.Data;
    entity viewData as projection on mesDb.ViewData;
    entity elementsData as projection on mesDb.ElementsData;
    entity listData as projection on mesDb.ListData;

    entity TbHeadersData as projection on mesDb.TableHeaders;
    entity TbColumnsData as projection on mesDb.TableColumns;

    entity chartData as projection on mesDb.ChartData;
    entity chartXaxis as projection on mesDb.chartXaxis;
    entity chartYaxis as projection on mesDb.chartYaxis;
    //entity chartMeasure as projection on mesDb.ChartMeasures;
    //entity chartValue as projection on mesDb.ChartValues;
}   
