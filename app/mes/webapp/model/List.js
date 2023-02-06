sap.ui.define([
    "mes/model/BaseObject"
  ], function (BaseObject) {
    "use strict";
    return BaseObject.extend("mes.model.List", {
      constructor: function () {
        BaseObject.call(this);
        this.createList = createList;
      }
    });
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
  })
  