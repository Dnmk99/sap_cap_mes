const pageModel = new sap.ui.model.json.JSONModel();
const tableModel = new sap.ui.model.json.JSONModel();
const chartModel = new sap.ui.model.json.JSONModel();
tableModel["ColumnsData"] = [];
tableModel["Headers"] = [];
chartModel["oData"]=[];
chartModel.oData["AxisData"] = [];
const listModel = new sap.ui.model.json.JSONModel();
let viewDataArr = [];
const mainContArr = [];
let iArr = [];
function createElement(el, contPosition, that) {
    if (Object.keys(sap.m).includes(el.elementType)) {
        nEl = new sap.m[`${el.elementType}`]();
        switch (el.elementType) {
            case "ObjectHeader":
                nEl.setTitle(el.elementText);
                break;
            case "Title":
                nEl.setText(el.elementText);
                break;
            case "Text":
                nEl.setText(el.elementText);
                setTextSize(el, nEl);
                break;
            case "Label":
                nEl.setText(el.elementText);
                nEl.addStyleClass("Label");
                setTextSize(el, nEl);
                break
            case "Button":
                createButton(el, that);
                break;
            case "Input":
                createInput(el);
                break;
            case "Table":
                createTable(el, that);
                break;
            case "List":
                createList(el);
                break;
            case "Empty":
                createEmpty(el)
            default:
                break;
        }
        //_____Add element to content_____
        for (let i = 0; i < viewDataArr.length; i++) {
            if (viewDataArr[i].splitter !== null) {
                nEl.addStyleClass('split-Large-Element')
            }
        }
        contPosition.addItem(nEl);
        
    } else if (el.elementType.toLowerCase() == 'icon') {
        nEl = new sap.ui.core.Icon({
            src: el.elementText,
            color: el.description,
        });
        switch (el.size.toLowerCase()) {
            case 'small':
                nEl.addStyleClass('icon-Small');
                break;
            case 'medium':
                nEl.addStyleClass('icon-Medium');
                break;
            case 'large':
                nEl.addStyleClass('icon-Large');
                break;
            default:
                nEl.addStyleClass('icon-auto');
                break;
        }
        contPosition.addItem(nEl);
    }else if(el.elementType.toLowerCase() == "chart"){
        createChart(el);
        contPosition.addItem(nEl);
        nEl.addStyleClass('large-Element'); //test
        for(let i = 0; i < viewDataArr.length; i++){
            if (viewDataArr[i].splitter !== null) {
                nEl.removeStyleClass('large-Element chart');
                nEl.addStyleClass('split-Large-Element');
            }
        }
    } else { //if element is not in sap.m or is not a icon or chart
        let errText = new sap.m.Text({
            text:
                "Element " + ' "' + el.elementType.toUpperCase() + '" ' + " neexistuje",
        }).addStyleClass("errorClass");
        contPosition.addItem(errText);
    }
}
function createButton(el, that) {

    nEl = new sap.m[`${el.elementType}`]({
        text: el.elementText,
        press : function(){
            that.sendToDb(el);
        }
    });
    switch (el.size.toLowerCase()) {
        case "small":
            nEl.addStyleClass('btn-Small');
            break;
        case "medium":
            nEl.addStyleClass('btn-Medium');
            break;
        case "large":
            nEl.addStyleClass('btn-Large');
            break;
        case "auto":
            nEl.addStyleClass('btn-Auto');
            break;
        default:
            nEl.addStyleClass('btn-Auto');
            break;
    }
    return nEl;
}
function createInput(el) {
    nEl = new sap.m[`${el.elementType}`]({
        value : el.description
    })
    switch (el.size.toLowerCase()) {
        case "small":
            nEl.setWidth('5rem');
            break;
        case "medium":
            nEl.setWidth('10rem');
            break;
        case "large":
            nEl.setWidth('15rem');
            break;
        case "auto":
            nEl.setWidth('auto');
            break;
        default:
            nEl.setWidth('10rem');
            break;
    }
    let iObj = {
        'name' : el.uAttribute,
        'value' : nEl.getValue()
    }
    iArr.push(iObj)
}
function createTable(el) {
    const headers = tableModel.Headers;
    const tbData = tableModel.ColumnsData;
    const dataModel = new sap.ui.model.json.JSONModel();
    dataModel.setData({
        columns: headers,
        rows: tbData
    });
    let title = new sap.m.Title({
        text: el.elementText
    })
    let toolbar = new sap.m.OverflowToolbar({
        content: title
    })
    nEl = new sap.m.Table({
        headerToolbar: toolbar
    });
    nEl.setModel(dataModel);
    nEl.bindAggregation("columns", "/columns", function (index, context) {
        return new sap.m.Column({
            hAlign: 'Center',
            header: new sap.m.Label({
                text: context.getObject().header
            }),
        });
    });
    switch (el.size.toLowerCase()) {
        case "small":
            nEl.setWidth('30rem')
            break;
        case "medium":
            nEl.setWidth('50rem')
            break;
        case "large":
            nEl.setWidth('100vw')
            break;
        case "auto":
            nEl.setWidth('auto')
            break;
        case "maxwidth":
            nEl.setWidth('100vw')
            break;
        default:
            nEl.setWidth('auto')
            break;
    }
    for(let i = 0; i < viewDataArr.length; i++){
        if (viewDataArr[i].splitter !== null) { //kdyz je split view
            nEl.removeStyleClass('large-Element table');
            nEl.addStyleClass('split-Large-Element split-table');
       }else {
            nEl.addStyleClass('large-Element table');
       }
    }
    nEl.bindItems("/rows", function (index, context) {
        var rowData = context.getObject();
        var row = new sap.m.ColumnListItem({
        });
        for (var i in rowData) {
            row.addCell(new sap.m.Text({
                text: rowData[i],
                textAlign: "Center"
            }));
        }
        return row;
    });
    

}
function createList(el) {
    nEl = new sap.m[`${el.elementType}`]({
    });
    nEl.setModel(listModel)
    nEl.bindItems({
        path: "/",
        sorter: new sap.ui.model.Sorter("title"),
        template: new sap.m.StandardListItem({
            title: "{title}",
            info: "{right}",
            description: "{left}",
            infoState: "{state}",
            wrapping: true
        })
    });
    switch (el.size.toLowerCase()) {
        case "small":
            nEl.setWidth('15rem')
            break;
        case "medium":
            nEl.setWidth('25rem')
            break;
        case "large":
            nEl.setWidth('50rem')
            break;
        case "auto":
            nEl.setWidth('auto')
            break;
        case "maxwidth":
            nEl.setWidth('100vw')
            break;
        default:
            nEl.setWidth('auto')
            break;
    }
    nEl.addStyleClass('large-Element list'); //test
    for(let i = 0; i < viewDataArr.length; i++){
        if (viewDataArr[i].splitter !== null) {
            nEl.removeStyleClass('large-Element list');
            nEl.addStyleClass('split-Large-Element split-list');
       }
    }
    return nEl;

}
function createChart(el) {
    const titles = chartModel.oData
    nEl = new sap.viz.ui5.controls.VizFrame({
        vizType: el.description, 
    });
    nEl.setVizProperties({
        plotArea: {
            colorPalette: d3.scale.category20().range(),
            dataLabel: {
                showTotal: true
            }
        },
        tooltip: {
            visible: true
        },
        title: {
            text: el.elementText
        }
    });
    nEl.setModel(chartModel);
    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
        dimensions: [
            {
            name: titles.xTitle,
            value: "{xData}"
            },
        ],
        measures: [
            {
            name: titles.yTitle,
            value: "{yData}"
            }, 
        ],
        data: {
            path: "/AxisData"
        }
    });
    nEl.setDataset(oDataset);

    var oFeedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
        "uid": "valueAxis",
        "type": "Measure",
        "values": [titles.yTitle]
    });
    var oFeedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
        "uid": "categoryAxis",
        "type": "Dimension",
        "values": [titles.xTitle]
    });
    var oFeedColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
        "uid": "color",
        "type": "Dimension",
        "values": [titles.xTitle]
    });
    nEl.addFeed(oFeedValueAxis);
    nEl.addFeed(oFeedCategoryAxis);
    nEl.addFeed(oFeedColor);
    if(el.size){
        switch(el.size.toLowerCase()){
            case 'small':
                nEl.setWidth('20rem');
                nEl.setHeight('15rem')
                break;
            case 'medium':
                nEl.setWidth('30rem');
                nEl.setHeight('20rem')
                break;
            case 'large':
                nEl.setWidth('50rem');
                nEl.setHeight('25rem')
                break;
            default:
                break;  
        }
    }
}
function createEmpty(el){
    nEl = new sap.m.VBox({
        width : el.elWidth,
        height : el.elHeight
    });
    nEl.addStyleClass('hidden');
}
function setTextSize(el) {
    if (el.size) {
        switch (el.size.toLowerCase()) {
            case 'small':
                nEl.addStyleClass('font-Small');
                break;
            case 'medium':
                nEl.addStyleClass('font-Medium');
                break;
            case 'large':
                nEl.addStyleClass('font-Large');
                break;
            case 'xlarge':
                nEl.addStyleClass('font-X-Large');
                break;
            case 'auto':
                nEl.addStyleClass('font-Auto');
                break;
            default:
                nEl.addStyleClass('text-Auto');
                break;
        }
        return nEl
    }
    
}
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "mes/model/Person",
    'sap/viz/ui5/data/FlattenedDataset',
    'sap/viz/ui5/controls/common/feeds/FeedItem',
    'sap/viz/ui5/format/ChartFormatter',
    'sap/viz/ui5/api/env/Format',
    "sap/ui/core/Element"
],

    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Person) {
        "use strict";
        return Controller.extend("mes.controller.View1", {

            frontendToBackendLoop(){
                const that = this;
                const oModel = this.getOwnerComponent().getModel('data');
                let subCont;
                const rArr = [];
                const viewsArr = [];
                pageModel.oData["Elements"] = [];
                pageModel.oData["Views"] = [];
                oModel.read(`/viewData`, {
                    success: function (vData) {
                        const list = [];
                        for (const [key, value] of Object.entries(vData.results)) {
                            const obj = {
                                id: value.ID,
                                viewId : value.ViewId,
                                headerLeft: value.ViewTitleLeft,
                                headerMiddle: value.ViewTitleMiddle,
                                headerRight: value.ViewTitleRight,
                                height: value.Height,
                                width: value.Width,
                                enterEvent: value.EnterEvent,
                                vAlignView: value.vAlign, // custom
                                hAlignView: value.hAlign, // custom Stretch,Start,Inherit,End,Center,Baseline
                                numOfRows: value.numOfRows,
                                scrollable: value.scrollable,
                                splitter : value.splitter,
                                splitView : value.splitView
                            }
                            list.push(obj);
                        }
                        list.forEach(e => {
                            pageModel.oData.Views.push(e)
                        });
                        const viewData = pageModel.oData.Views;
                        for(let i = 0; i < viewData.length; i++){
                            // if (viewData[i].splitter === null) {
                                var vData = viewData[i];
                                viewDataArr.push(vData)
                                viewsArr.push(vData);
                                that.getView().byId('gen').setWidth('auto')
                                let mainCont = new sap.m.VBox('mainCont-'+vData.viewId,{
                                    width : '100%',
                                    height : 'auto',
                                    justifyContent : vData.vAlignView,
                                    alignItems : vData.hAlignView,
                                    wrap:'Wrap'
                                });
                                mainContArr.push(mainCont)
                                for(let j = 1; j <= Number(vData.numOfRows); j++){
                                    subCont = new sap.m.HBox("row-" + vData.viewId + '-' + j, {wrap:'Wrap'});
                                    subCont.addStyleClass('subCont');
                                    mainCont.addItem(subCont);
                                    rArr.push(subCont);
                                }
                            // }else{
                            //     var vData = viewData[i];
                            //     viewDataArr.push(vData)
                            //     viewsArr.push(vData);
                            //     that.getView().byId('gen').setWidth('auto')
                            //     var mainCont = new sap.m.VBox('mainCont-'+vData.viewId,{
                            //         width : '100%',
                            //         height : 'auto',
                            //         justifyContent : vData.vAlignView,
                            //         alignItems : vData.hAlignView,
                            //         wrap:'Wrap'
                            //     });
                            //     mainContArr.push(mainCont)
                            //     for(let j = 1; j <= Number(vData.numOfRows); j++){
                            //         subCont = new sap.m.HBox("row-" + vData.viewId + '-' + j, {wrap:'Wrap'});
                            //         subCont.addStyleClass('subCont');
                            //         mainCont.addItem(subCont);
                            //         rArr.push(subCont);
                            //     }
                            // }
                        }
                        that.getView().byId('page').setEnableScrolling(pageModel.oData.Views[0].scrollable)
                        const headerMiddle = that.getView().byId("headerMiddleTitle");
                        const headerLeft = that.getView().byId("headerLeftText");
                        const headerRight = that.getView().byId("headerRightText");
                        headerMiddle.setText(pageModel.oData.Views[0].headerMiddle); //set view title
                        headerLeft.setText();
                        headerRight.setText()
                    },
                    error: function (vEr) {
                        console.log(vEr);
                    }
                });
                oModel.read(`/listData`, {
                    success: function (lData) {
                        const list = [];
                        for (const [key, value] of Object.entries(lData.results)) {
                            const obj = {
                                title: value.Title,
                                left: value.Description,
                                right: value.Info,
                                state: value.State
                            }
                            list.push(obj)
                        }
                        listModel["oData"] = []
                        list.forEach(e => {
                            listModel.oData.push(e);
                        });
                    },
                    error: function (lEr) {
                        console.log(lEr);
                    }
                });
                oModel.read(`/TbColumnsData`, {
                    success: function (colData) {
                        const list = [];
                        let keyArr = [];
                        for (let i = 0; i < colData.results.length; i++) {
                            keyArr.push(['col' + i])
                        }
                        Object.entries(colData.results).forEach(entry => {
                            const [key, value] = entry;
                            for (var property in value) {
                                if (value[property] == null) {
                                    value[property] = '-'
                                }
                            }
                            list.push(value);
                        });
                        list.forEach(e => {
                            tableModel.ColumnsData.push(e);
                        });
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
                oModel.read(`/TbHeadersData`, {
                    success: function (hData) {
                        const hList = [];
                        for (const [key, value] of Object.entries(hData.results[0])) {
                            if (key != '__metadata') {
                                const obj = {
                                    'header': value
                                }
                                hList.push(obj)
                            }
                        }
                        hList.forEach(e => {
                            tableModel.Headers.push(e)
                        });
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
                oModel.read(`/chartData/?`, {
                    urlParameters: {
                        "$expand": "xAxis,yAxis"
                    },
                    success: function (cData) {
                        const xAxisArr = [];
                        const yAxisArr = [];
                        const axisDataArr=[];
                        for (const [key, value] of Object.entries(cData.results)) {
                            const AxisObj = { // OSA X
                                'xData' : value.xAxis.axisData,
                                'yData' : value.yAxis.axisData
                            }
                            axisDataArr.push(AxisObj)
                            if (value.xAxisTitle !== null && value.yAxisTitle !== null) {
                                var xTitle = value.xAxisTitle;
                                var yTitle = value.yAxisTitle;
                            }
                        }
                        axisDataArr.forEach(e => {
                            chartModel.oData.AxisData.push(e)
                        });
                        chartModel.oData.xTitle=xTitle;
                        chartModel.oData.yTitle=yTitle;                  
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
                oModel.read(`/elementsData`, {
                    success: function (elData) {
                        const list = [];
                        for (let [key, value] of Object.entries(elData.results)) {
                            if (value === null) {
                                value = "";
                            }
                            const obj = {
                                'ID': value.ID,
                                'viewId' : value.viewID,
                                'elementType': value.elementType,
                                'elementText': value.elementText,
                                'description': value.description,
                                'nextView': value.nextView,
                                'rowPos': value.rowNumber,
                                'vAlign': value.vAlign,
                                'hAlign': value.hAlign,
                                'elWidth': value.elWidth,
                                'elHeight': value.elHeight,
                                'txtAlign': value.txtAlignement,
                                'vSpacing': value.vSpacing,
                                'hSpacing': value.hSpacing,
                                'size': value.size,
                                'elOrder' : value.elementOrder,
                                'tCode' : value.TransactionCode,
                                'uAttribute' : value.usedAttribute
                            }
                            list.push(obj);
                        }
                        list.forEach(e => {
                            pageModel.oData.Elements.push(e)
                        });
                        const oElements = pageModel.oData.Elements;
                        rArr.forEach(r => {
                            let row = r.getId();
                            let targetView = row.split('-')[1];
                            let rowId = row.split('-')[2];
                            for (const el of oElements) {
                                for(let i = 0; i < mainContArr.length; i++){
                                    let contId = mainContArr[i].getId().split('-')[1];
                                    if(el.viewId == contId){
                                        that.getView().byId('gen').addItem(mainContArr[i]);
                                        if (mainContArr[i].splitter) {
                                            mainContArr[i].addStyleClass('splitCont')
                                        }
                                        
                                    }
                                    // else{
                                    //     //mainContArr.pop(i);
                                    // }
                                }
                                if (targetView == el.viewId && rowId == el.rowPos) {
                                    if (el.vSpacing == null) {
                                        el.vSpacing = 'none';
                                    }
                                    let vSpacing = el.vSpacing.toLowerCase();
                                    switch (vSpacing) {
                                        case 'tiny':
                                            r.addStyleClass('vSpacingTiny');
                                            break;
                                        case 'small':
                                            r.addStyleClass('vSpacingSmall');
                                            break;
                                        case 'medium':
                                            r.addStyleClass('vSpacingMedium');
                                            break;
                                        case 'large':
                                            r.addStyleClass('vSpacingLarge');
                                            break;
                                        default:
                                            r.addStyleClass('None')
                                    }
                                    if (el.hAlign != "") {
                                        r.setJustifyContent(el.hAlign)
                                    }
                                    if (el.vAlign != "") {
                                        r.setAlignItems(el.vAlign)
                                    }
                                    let contPosition = r;
                                    createElement(el, contPosition, that);
                                }
                            }
                        });
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
                that.getView().setModel(pageModel);
            },
            onInit: function () {
                this.btn = new createButton()
                const test = this.btn.myFunction()  
                console.log(test);
                // this.getView().byId('box').addItem(test)
                const oModel = this.getOwnerComponent().getModel('data');
                oModel.create(`/spath`,{
                    success : function (){ //v successu this.frontendToBackendLoop();

                    },
                    error : function (postError){
                        console.log(postError);
                    }
                })
            },

            onBeforeRendering: function () {
                console.log(this.p.myFunction());
                this.frontendToBackendLoop(); //pozdeji bude v successu 
            },
            sendToDb : function(el){
                const that = this
                const data = {
                    nextView: el.nextView,
                    tCode: el.tCode,
                    values : iArr
                }
                console.log(data);
                const oModel = this.getView().getModel('data')
                oModel.create(`/spath`,{ 
                    success : function (){ //v successu this.frontendToBackendLoop();
                        console.log('asdf');
                    },
                     error: function (postError) {
                        console.log(postError);
                    }
                })
            }
        });
    });