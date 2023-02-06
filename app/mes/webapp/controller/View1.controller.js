const pageModel = new sap.ui.model.json.JSONModel();
const tableModel = new sap.ui.model.json.JSONModel();
const chartModel = new sap.ui.model.json.JSONModel();
const listModel = new sap.ui.model.json.JSONModel();
const viewDataArr = [];
const mainContArr = [];
const iArr = [];
pageModel.oData["Elements"] = [];
pageModel.oData["Views"] = [];
tableModel["ColumnsData"] = [];
tableModel["Headers"] = [];
chartModel["oData"] = [];
chartModel.oData["AxisData"] = [];
function createElement(el, contPosition, that) {
    if (Object.keys(sap.m).includes(el.elementType)) {
        nEl = new sap.m[`${el.elementType}`]();
        switch (el.elementType.toLowerCase()) {
            case "objectheader":
                nEl.setTitle(el.elementText);
                break;
            case "title":
                nEl.setText(el.elementText);
                break;
            case "text":
                nEl.setText(el.elementText);
                that.textSize.setTextSize(el)
                break;
            case "label":
                nEl.setText(el.elementText);
                nEl.addStyleClass("Label");
                that.textSize.setTextSize(el)
                break
            case "button":
                that.button.createButton(el, that);
                break;
            case "input":
                that.input.createInput(el, that);
                break;
            case "table":
                that.table.createTable(el);
                break;
            case "list":
                that.list.createList(el);
                break;
            case "empty":
                that.list.createEmpty(el);
            default:
                break;
        }
        for (let i = 0; i < viewDataArr.length; i++) {
            if (viewDataArr[i].splitter !== null) {
                nEl.addStyleClass('split-Large-Element')
            }
        }
        //_____Add element to content_____
        contPosition.addItem(nEl);
    }
    if (el.elementType.toLowerCase() == 'icon') {
        that.icon.createIcon(el);
        contPosition.addItem(nEl);
    }
    if (el.elementType.toLowerCase() == "chart") {
        that.chart.createChart(el, viewDataArr);
        contPosition.addItem(nEl);
    }
}
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Element",
    "mes/model/Button",
    "mes/model/Input",
    "mes/model/List",
    "mes/model/Table",
    "mes/model/Chart",
    "mes/model/Icon",
    "mes/model/Empty",
    "mes/model/SetTextSize",
    'sap/viz/ui5/data/FlattenedDataset',
    'sap/viz/ui5/controls/common/feeds/FeedItem',
    'sap/viz/ui5/format/ChartFormatter',
    'sap/viz/ui5/api/env/Format',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Element, Button, Input, List, Table, Chart, Icon, Empty, SetTextSize) {
        "use strict";
        return Controller.extend("mes.controller.View1", {
            frontendToBackendLoop() {
                const that = this;
                const oModel = this.getOwnerComponent().getModel('data');
                const rArr = [];
                const viewsArr = [];
                let subCont;
                oModel.read(`/viewData`, {
                    success: function (vData) {
                        const list = [];
                        for (const [key, value] of Object.entries(vData.results)) {
                            const obj = {
                                id: value.ID,
                                viewId: value.ViewId,
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
                                splitter: value.splitter,
                                splitView: value.splitView
                            }
                            list.push(obj);
                        }
                        list.forEach(e => {
                            pageModel.oData.Views.push(e)
                        });
                        const viewData = pageModel.oData.Views;
                        for (let i = 0; i < viewData.length; i++) {
                            var vData = viewData[i];
                            viewDataArr.push(vData)
                            viewsArr.push(vData);
                            that.getView().byId('gen').setWidth('auto')
                            let mainCont = new sap.m.VBox('mainCont-' + vData.viewId, {
                                width: '100%',
                                height: 'auto',
                                justifyContent: vData.vAlignView,
                                alignItems: vData.hAlignView,
                                wrap: 'Wrap'
                            });
                            mainContArr.push(mainCont)
                            for (let j = 1; j <= Number(vData.numOfRows); j++) {
                                subCont = new sap.m.HBox("row-" + vData.viewId + '-' + j, { wrap: 'Wrap' });
                                subCont.addStyleClass('subCont');
                                mainCont.addItem(subCont);
                                rArr.push(subCont);
                            }
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
                        console.log(colData);
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
                        const axisDataArr = [];
                        for (const [key, value] of Object.entries(cData.results)) {
                            const AxisObj = { // OSA X
                                'xData': value.xAxis.axisData,
                                'yData': value.yAxis.axisData
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
                        chartModel.oData.xTitle = xTitle;
                        chartModel.oData.yTitle = yTitle;
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
                                'viewId': value.viewID,
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
                                'elOrder': value.elementOrder,
                                'tCode': value.TransactionCode,
                                'uAttribute': value.usedAttribute
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
                                for (let i = 0; i < mainContArr.length; i++) {
                                    let contId = mainContArr[i].getId().split('-')[1];
                                    if (el.viewId == contId) {
                                        that.getView().byId('gen').addItem(mainContArr[i]);
                                        if (mainContArr[i].splitter) {
                                            mainContArr[i].addStyleClass('splitCont')
                                        }

                                    }
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
                this.getView().setModel(pageModel);
            },
            onInit: function () {
                //element classes
                this.button = new Button();
                this.input = new Input();
                this.list = new List();
                this.table = new Table();
                this.chart = new Chart();
                this.icon = new Icon();
                this.empty = new Empty();
                this.textSize = new SetTextSize();
                const compName = 'asdf'; //test
                const oModel = this.getOwnerComponent().getModel('data');
                //initial call
                oModel.create(`/spath`, { //trigger first step
                    success: function () { //v successu this.frontendToBackendLoop();
                        //componentName : value
                    },
                    error: function (postError) {
                        console.log(postError);
                    }
                })
            },
            onBeforeRendering: function () {
                this.frontendToBackendLoop(); //pozdeji bude v successu 
            },
            sendToDb: function (el) {
                const data = {
                    nextView: el.nextView,
                    tCode: el.tCode,
                    values: iArr
                    //isGlobal : true-false
                }
                console.log(data);
                const oModel = this.getView().getModel('data')
                oModel.create(`/spath`, {
                    success: function () { //v successu this.frontendToBackendLoop();
                        console.log('asdf');
                    },
                    error: function (postError) {
                        console.log(postError);
                    }
                })
            }
        });
    });