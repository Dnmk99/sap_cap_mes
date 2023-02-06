sap.ui.define([
    "mes/model/BaseObject",
  ], function (BaseObject) {
    "use strict";
    return BaseObject.extend("mes.model.Chart", {
      constructor: function () {
        BaseObject.call(this);
        this.createChart = createChart;
      }
    });
    function createChart(el, viewDataArr) {
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
        for(let i = 0; i < viewDataArr.length; i++){
            if (viewDataArr[i].splitter !== null) {
                nEl.removeStyleClass('large-Element chart');
                nEl.addStyleClass('split-Large-Element');
            }
        }
        return nEl
    }
  })
  