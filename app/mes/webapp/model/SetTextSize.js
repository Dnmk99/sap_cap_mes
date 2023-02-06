sap.ui.define([
    "mes/model/BaseObject"
  ], function (BaseObject) {
    "use strict";
    return BaseObject.extend("mes.model.SetTextSize", {
      constructor: function () {
        BaseObject.call(this);
        this.setTextSize = SetTextSize;
      }
    });
    function SetTextSize(el) {
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
  })
  