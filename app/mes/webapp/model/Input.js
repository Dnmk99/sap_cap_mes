sap.ui.define([
    "mes/model/BaseObject"
  ], function (BaseObject) {
    "use strict";
    return BaseObject.extend("mes.model.Input", {
      constructor: function () {
        BaseObject.call(this);
        this.createInput = createInp;
      }
    });
    function createInp(el) {
        nEl = new sap.m[`${el.elementType}`]({
            
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
        return nEl, iArr
    }
  })
  