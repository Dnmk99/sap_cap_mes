const req = require("@sap/cds");
module.exports = async function(){
    const db = await cds.connect.to('db');
    const { elements } = db.entities;
    console.log("asdf");
    // class appCore{
    //     constructor(btnAction) {
    //         this.userAction = btnAction;
    //         this.setFirstStep();
    //     }
    //     setFirstStep(){
    //         if(btnEvent == ''){

    //         }
    //     }
    // }
}
const cds = req;
