namespace mesDb;
entity ElementsData{
    key ID : Integer;
    viewID : String;
    elementType : String;
    elementText : String;
    description : String;
    nextView : String;
    rowNumber : String;
    vAlign : String;
    hAlign : String;
    elWidth : String;
    elHeight : String;
    txtAlign : String;
    vSpacing : String;
    hSpacing : String;    
    size : String;
    elementOrder : String;
    TransactionCode: String;
    usedAttribute : String;
}

entity ViewData {
    key ID : Integer;
    ViewId : Integer;
    ViewTitleLeft : String;
    ViewTitleMiddle : String;
    ViewTitleRight : String;
    Height : String;
    Width : String;
    EnterEvent : String;
    vAlign : String;
    hAlign : String;
    numOfRows : Integer;
    scrollable : Boolean;
    splitter : String;
    splitView : String;
}

entity ListData{
    Title : String;
    Description : String;
    Info : String;
    State : String;
}
entity TableHeaders{
    Header1 : String;
    Header2 : String;
    Header3 : String;
    Header4 : String;
}
entity TableColumns{
    key col1 : Integer;
    col2 : String;
    col3 : String;
    col4 : String;
    col5 : String;
} 

entity ChartData{
    key ID : Integer;
    xAxisTitle : String;
    xAxis : Association to chartXaxis;
    yAxisTitle : String; 
    yAxis : Association to chartYaxis;
    
}
entity chartXaxis{
    key ID: Integer;
    axisData : String
}
entity chartYaxis{
    key ID: Integer;
    axisData : String
}