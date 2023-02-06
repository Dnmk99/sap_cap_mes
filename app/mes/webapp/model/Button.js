sap.ui.define([
  "mes/model/BaseObject"
], function (BaseObject) {
  "use strict";
  return BaseObject.extend("mes.model.Button", {
    constructor: function () {
      BaseObject.call(this);
      this.createButton = createButton;
    }
  });
  function createButton(el,that) {
    nEl = new sap.m[`${el.elementType}`]({
      type : 'Default', //Unstyled
      text: el.elementText,
      press: function () {
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
})
