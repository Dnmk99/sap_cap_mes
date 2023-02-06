sap.ui.define([
    "mes/model/BaseObject"
  ], function (BaseObject) {
    "use strict";
    return BaseObject.extend("mes.model.Table", {
      constructor: function () {
        BaseObject.call(this);
        this.createTable = createTable;
      }
    });
    function createTable(el) {
        const headers = tableModel.Headers;
        const tbData = tableModel.ColumnsData;
        const dataModel = new sap.ui.model.json.JSONModel();
        console.log(tableModel);
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
  })
  