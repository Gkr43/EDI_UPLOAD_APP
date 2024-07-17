sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";
//comment
    return Controller.extend("ediupload.controller.View1", {
        onInit: function () {
            this.oModel=this.getOwnerComponent().getModel();
           this.ReadEDI();
           
           
           
            
        },
        ReadEDI:function(){
            var that=this;
            var BusyDialog= new sap.m.BusyDialog();
            BusyDialog.open();
            this.oModel.read("/ZC_EDI_UPLOAD",{
                success:function(oData,OResponse){
                    BusyDialog.close();
                    var json = new sap.ui.model.json.JSONModel(oData);
                    that.getView().setModel(json,'EdiModel');
                    that.byId("EdiList_id").setHeaderText("Records("+oData.results.length+")");

                },error:function(oErr){
                    BusyDialog.close();
                }
            });
        },
        onUpload: function (e) {
            this._import(e.getParameter("files") && e.getParameter("files")[0]);
        },
        _import: function (file) {
            var that = this;
            var excelData = {};
            if (file && window.FileReader) {
                var reader = new FileReader();
                reader.onload = function (e) {
                   var data = e.target.result;
                   var aRow=data.split(',');
                   var EDINumber = aRow[39];
                   var ODNNumber = aRow[8];
                   var EDIArray=this.getView().getModel('EdiModel').getData().results.map(function(e){return e.EDI_Number})
                   if(EDIArray.indexOf(EDINumber)>-1){
                        this.UpdateEDI({"EDI_Number":EDINumber,"ODN_Number":ODNNumber});
                   }else{
                        this.createEDI({"EDI_Number":EDINumber,"ODN_Number":ODNNumber});
                   }
                   
                    
                }.bind(this);
                reader.onerror = function (ex) {
                    console.log(ex);
                };
                reader.readAsBinaryString(file);
            }
        },
        UpdateEDI:function(obj){
            var that=this;
            var BusyDialog= new sap.m.BusyDialog();
            BusyDialog.open();
            this.oModel.update("/ZC_EDI_UPLOAD('"+obj.EDI_Number+"')",obj,{
                success:function(oData,OResponse){
                    BusyDialog.close();
                   sap.m.MessageToast.show('Edino is Successfully Updated');
                   that.ReadEDI();

                },error:function(oErr){
                    BusyDialog.close();
                }
            });
        },
        createEDI:function(obj){
            var that=this;
            var BusyDialog= new sap.m.BusyDialog();
            BusyDialog.open();
            this.oModel.create("/ZC_EDI_UPLOAD",obj,{
                success:function(oData,OResponse){
                    BusyDialog.close();
                   sap.m.MessageToast.show('Edino is Successfully Created');
                   that.ReadEDI();

                },error:function(oErr){
                    BusyDialog.close();
                }
            });

        }
    });
});
