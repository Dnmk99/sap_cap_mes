sap.ui.define([
    "mes/model/BaseObject"
  ], function (BaseObject) {
    "use strict";
    return BaseObject.extend("mes.model.Icon", {
      constructor: function () {
        BaseObject.call(this);

        this.createIcon = createIcon;
      }
    });
    function createIcon(el){
      nEl = new sap.ui.core.Icon({src: el.elementText,color: el.description,});
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
        return nEl
    }

    
    
    
  })
  