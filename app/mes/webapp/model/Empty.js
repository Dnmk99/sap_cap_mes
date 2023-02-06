sap.ui.define([
    "mes/model/BaseObject"
  ], function (BaseObject) {
    "use strict";
    return BaseObject.extend("mes.model.Empty", {
      constructor: function () {
        BaseObject.call(this);
        this.createEmpty = createEmpty;
      }
    });
    function createEmpty(el){
        nEl = new sap.m.VBox({
            width : el.elWidth,
            height : el.elHeight
        });
        nEl.addStyleClass('hidden');
        return nEl
    }
  })
  



