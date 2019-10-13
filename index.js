/*
************************************************
*  Auther      : Er. Ashok Devatwal
*  Description : Inventory Management
*  Vendor      : ARS Technologies  
************************************************
*/

// Import Package 
const electron 	 = require('electron');
const path 		   = require('path');
const url 		   = require('url');
const fs         = require('fs');
const bcrypt     = require('bcrypt');

// Custom Import
var config       = require('./database/config.js');
var dbSchema     = require('./database/databaseSchema.js');
var menuTemplate = require('./menu.js');
var Preferences  = require('./preferencesConfig.js');
var DB           = require('./database/databaseQuery.js');


// Import Modules
const {dialog,app,Menu,BrowserWindow,shell,ipcMain} = electron;
const {download} = require("electron-dl");

// Salt Rounds For Password Hash
const saltRounds = 10;

// Make Application Directory
if (!fs.existsSync(config.appDir)) {
  fs.mkdirSync(config.appDir);
}

// Make Database Directory
if (!fs.existsSync(config.dbDir)) {
  fs.mkdirSync(config.dbDir);
}

// Initialize Knex Instanse
var knex = config.connectDb(config.dbClient,config.dbConn[config.dbClient]);

// Create Database Tables If Not Exits
dbSchema.migration(knex);

// Create Post Install Preferences file
const install = new Preferences({
  // We'll call our data file 'application-preferences'
  configName: 'application-preferences',
  defaults: {
    windowBounds: { width: 800, height: 600 }
  }
});

// Variable Declaration
  // Welcome
  let welcomeWindow;
  // login
  let loginWindow;
  // main 
  let mainWindow;
  // Setting
  let settingWindow;
  // Expance
  let addExpanceWindow;
  let editExpanceWindow;
  // Vendor
  let addVendorWindow;
  let editVendorWindow;
  // Product
  let addProductWindow;
  let editProductWindow;
  // Purchase
  let addPurchaseWindow;
  let editPurchaseWindow;
  // Sale
  let addSaleWindow;
  let editSaleWindow;
  let invoiceWindow;
  // Login State
  let isLogin = false; 

app.on('ready', () => {

  if( install.get('isInstalled') == undefined ) {
    // Frist Run Of Application
    createWelcomeWindow();
  }else if( install.get('isInstalled') == true ) {
    // Application Run For Use 
    createLoginWindow();
  }

	// Create Menu From Template
	var osxMenu = Menu.buildFromTemplate(menuTemplate.template);
	Menu.setApplicationMenu(osxMenu);
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

/*
************************************************
*  Application Windows
************************************************
*/

// Login Window
function createLoginWindow() {
  
  loginWindow = new BrowserWindow({width: 1360, height: 700});
  
  loginWindow.loadURL(url.format({
    pathname:path.join(__dirname,"/pages/login.html"),
    protocal:'file:',
    slashes:true
  }));

  loginWindow.webContents.once('did-finish-load',function(evt) {
    loginWindow.setTitle("StockBits - ARS Technologies Alwar-Rajasthan");
  });

  loginWindow.on('closed', function () {
    loginWindow = null;
  });

}

// Welcome Window
function createWelcomeWindow() {
  
  welcomeWindow = new BrowserWindow({width: 1360, height: 700});
  
  welcomeWindow.loadURL(url.format({
    pathname:path.join(__dirname,"/pages/welcome/index.html"),
    protocal:'file:',
    slashes:true
  }));

  welcomeWindow.webContents.once('did-finish-load',function(evt) {
    welcomeWindow.setTitle("StockBits - ARS Technologies Alwar-Rajasthan");
  });

  welcomeWindow.on('closed', function () {
    welcomeWindow = null;
  });

}

/* Main Window */
function createWindow () {
  
  mainWindow = new BrowserWindow({width: 1360, height: 700});
  
  mainWindow.loadURL(url.format({
  	pathname:path.join(__dirname,"/pages/master.html"),
  	protocal:'file:',
  	slashes:true
  }));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

}

/* Setting Window */
function createSettingWindow () {
  // Create Window
  settingWindow = new BrowserWindow({width: 600, height: 660,title:'Setting'});
  // Load Html file Into Window 
  settingWindow.loadURL(url.format({
    pathname:path.join(__dirname,"/pages/setting.html"),
    protocal:'file:',
    slashes:true
  }));
  
  settingWindow.webContents.once('did-finish-load',function(evt) {
    DB.user(knex).then(function(row){
      settingWindow.webContents.send("LoadData:User",row);
    });
  });
  // Emitted when the window is closed.
  settingWindow.on('closed', function () { settingWindow = null; })

}

/* Expance Window */
function createAddExpanceWindow(){
  addExpanceWindow = new BrowserWindow({resizable:false ,parent: mainWindow,width: 450, height: 547,title:'Add Expance'});
  // Load Main Html file Into Window 
  addExpanceWindow.loadURL(url.format({
    pathname:path.join(__dirname,"/pages/addExpance.html"),
    protocal:'file:',
    slashes:true
  }));

  addExpanceWindow.on('closed', function () { addExpanceWindow = null; }) 

}

function createEditExpanceWindow(id) {
  let editExpanceId = id ;
   editExpanceWindow = new BrowserWindow({resizable:false ,parent: mainWindow,width: 450, height: 547,title:'Edit Expance'});
  // Load Main Html file Into Window 
  editExpanceWindow.loadURL(url.format({
    pathname:path.join(__dirname,"/pages/editExpance.html"),
    protocal:'file:',
    slashes:true
  }));

  editExpanceWindow.webContents.once('did-finish-load',function(evt) {
    DB.expanceById(knex,editExpanceId).then(function(row){
      editExpanceWindow.webContents.send("LoadEdit:Expance",row);
    });
  });

  editExpanceWindow.on('closed', function () { editExpanceWindow = null; }) 

}

/* Vendor Window */
function createAddVendorWindow(){
  addVendorWindow = new BrowserWindow({resizable:false ,parent: mainWindow,width: 800, height: 440,title:'Add Vendor'});
  // Load Main Html file Into Window 
  addVendorWindow.loadURL(url.format({
    pathname:path.join(__dirname,"/pages/addVendor.html"),
    protocal:'file:',
    slashes:true
  }));

  addVendorWindow.on('closed', function () { addVendorWindow = null; }) 

}


function createEditVendorWindow(id) {
  let editVendorId = id ;
  editVendorWindow = new BrowserWindow({resizable:false ,parent: mainWindow,width: 800, height: 440,title:'Edit Vendor'});
  // Load Main Html file Into Window 
  editVendorWindow.loadURL(url.format({
    pathname:path.join(__dirname,"/pages/editVendor.html"),
    protocal:'file:',
    slashes:true
  }));

  editVendorWindow.webContents.once('did-finish-load',function(evt) {
    DB.vendorById(knex,editVendorId).then(function(row){
      editVendorWindow.webContents.send("LoadEdit:Vendor",row);
    });
  });

  editVendorWindow.on('closed', function () { editVendorWindow = null; }) 

}

/* Product Window */
function createAddProductWindow(){
  addProductWindow = new BrowserWindow({resizable:false ,parent: mainWindow,width: 600, height: 400,title:'Add Product'});
  // Load Main Html file Into Window 
  addProductWindow.loadURL(url.format({
    pathname:path.join(__dirname,"/pages/addProduct.html"),
    protocal:'file:',
    slashes:true
  }));

  addProductWindow.on('closed', function () { addProductWindow = null; }) 

}

function createEditProductWindow(id) {
  let editProductId = id ;
  editProductWindow = new BrowserWindow({resizable:false ,parent: mainWindow,width: 600, height: 400,title:'Edit Product'});
  // Load Main Html file Into Window 
  editProductWindow.loadURL(url.format({
    pathname:path.join(__dirname,"/pages/editProduct.html"),
    protocal:'file:',
    slashes:true
  }));

  editProductWindow.webContents.once('did-finish-load',function(evt) {
    DB.productById(knex,editProductId).then(function(row){
      editProductWindow.webContents.send("LoadEdit:Product",row);
    });
  });

  editProductWindow.on('closed', function () { editProductWindow = null; }) 

}

/* Purchase Window */
function createAddPurchaseWindow(){
  addPurchaseWindow = new BrowserWindow({resizable:false ,parent: mainWindow,width: 1000, height: 510,title:'New Product Purchase'});
  // Load Main Html file Into Window 
  addPurchaseWindow.loadURL(url.format({
    pathname:path.join(__dirname,"/pages/addPurchase.html"),
    protocal:'file:',
    slashes:true
  }));

  addPurchaseWindow.webContents.once('did-finish-load',function(evt) {
    let vendor = knex.from('vendors')
    vendor.then(function(rows){
      addPurchaseWindow.webContents.send("Select:Vendor",rows);
    });

    let product = knex.from('products')
    product.then(function(rows){
      addPurchaseWindow.webContents.send("Select:Product",rows);
    });

  });

  addPurchaseWindow.on('closed', function () { addPurchaseWindow = null; }) 

}

function createEditPurchaseWindow(id) {
  let editPurchaseId = id ;
  editPurchaseWindow = new BrowserWindow({resizable:false ,parent: mainWindow,width: 1000, height: 510,title:'Edit Product Purchase'});
  // Load Main Html file Into Window 
  editPurchaseWindow.loadURL(url.format({
    pathname:path.join(__dirname,"/pages/editPurchase.html"),
    protocal:'file:',
    slashes:true
  }));

  editPurchaseWindow.webContents.once('did-finish-load',function(evt) {
    
    DB.vendors(knex).then(function(rows){
      editPurchaseWindow.webContents.send("Select:Vendor",rows);
    });

    DB.products(knex).then(function(rows){
      editPurchaseWindow.webContents.send("Select:Product",rows);
    });

    DB.purchaseById(knex,editPurchaseId).then(function(row){
      editPurchaseWindow.webContents.send("LoadEdit:Purchase",row);
    });

  });

  editPurchaseWindow.on('closed', function () { editPurchaseWindow = null; }) 

}

/* Sale Window */
function createAddSaleWindow(){
  addSaleWindow = new BrowserWindow({resizable:false ,parent: mainWindow,width: 600, height: 705,title:'New Product Sale'});
  // Load Main Html file Into Window 
  addSaleWindow.loadURL(url.format({
    pathname:path.join(__dirname,"/pages/addSale.html"),
    protocal:'file:',
    slashes:true
  }));

  addSaleWindow.webContents.once('did-finish-load',function(evt) {
    // drop down product
    DB.inStockProductsName(knex).then(function(rows){
      addSaleWindow.webContents.send("Select:Product",rows);
    });
  });

  addSaleWindow.on('closed', function () { addSaleWindow = null; }) 

}

function createEditSaleWindow(id) {
  let editSaleId = id ;
  editSaleWindow = new BrowserWindow({resizable:false ,parent: mainWindow,width: 600, height: 665,title:'Edit Product Sale'});
  // Load Main Html file Into Window 
  editSaleWindow.loadURL(url.format({
    pathname:path.join(__dirname,"/pages/editSale.html"),
    protocal:'file:',
    slashes:true
  }));

  editSaleWindow.webContents.once('did-finish-load',function(evt) {
    
    // drop down product
    DB.soldProductNameById(knex,editSaleId).then(function(row){
      editSaleWindow.webContents.send("Set:Product",row);
    });

    DB.soldProductById(knex,editSaleId).then(function(row){
      editSaleWindow.webContents.send("LoadEdit:Sale",row);
    });

  });

  editSaleWindow.on('closed', function () { editSaleWindow = null; }) 

}

/* Invoice Window */
function createInvoiceWindow (id) {
  // Create Window
  invoiceWindow = new BrowserWindow({width: 900, height: 700,title:'Invoice'});
  // Load Html file Into Window 
  invoiceWindow.loadURL(url.format({
    pathname:path.join(__dirname,"/pages/invoice.html"),
    protocal:'file:',
    slashes:true
  }));
  
  invoiceWindow.webContents.once('did-finish-load',function(evt) {
    
    DB.invoiceDataById(knex,id).then(function(row) {
      
      DB.user(knex).then(function(userData) {
        invoiceWindow.webContents.send("LoadData:Invoice",{row:row,userData:userData});  
      });

    });
  });
  // Emitted when the window is closed.
  invoiceWindow.on('closed', function () { invoiceWindow = null; })

}

/*
**********************************************************
*   Actions 
**********************************************************
*/

//logout

ipcMain.on("Logout",function(){
  createLoginWindow();
  mainWindow.close();
});

//login
ipcMain.on("Attemp:Login",function(evt,password) {

    DB.userPassword(knex).then( function (result) {
      bcrypt.compare(password, result.password, function(err, res) {
        if( res == true )
        {
          createWindow();
          loginWindow.close();
        }else
        {
          dialog.showMessageBox({
            type: 'warning',
            title: 'Login Failed',
            message: 'Invalid Credentials Please Try Again',
            buttons: ['OK'],
          });
        }
      });
    });
 });

// Welcome Form Data save
ipcMain.on("Save:User",function(evt,payLoad){

  bcrypt.hash(payLoad.password, saltRounds, function(err, hash) {
    
    let updateData = {
      name            : payLoad.name,
      bussiness_email : payLoad.bussiness_email,
      address         : payLoad.address,
      password        : hash,
    };

    DB.userUpdate(knex,updateData).then( function (result) { });

    install.set('isInstalled',true);  
    createWindow();
    welcomeWindow.close();
    
  });

});


//Report 
ipcMain.on("Filter:Custom:Sales",function(evt,filterDates){

  DB.soldProductsCountByFilterDates(knex,filterDates).then(function(rows) { 
    mainWindow.webContents.send("Report:SaleItems",rows);
  });

});  

ipcMain.on("Filter:Quick:Sales",function(evt,filter){

  // today 
  let today   = new Date();
  // date filter start from 
  let last = new Date(today.getTime() - (filter * 24 * 60 * 60 * 1000));

  let startday   = last.getDate();
  let startmonth = last.getMonth() + 1;
  let startyear  = last.getFullYear();

  if (startmonth < 10) 
    startmonth = "0" + startmonth;

  if (startday < 10) 
    startday = "0" + startday;

  let startDate = startyear+"-"+startmonth+"-"+startday;

  let year    = today.getFullYear();
  let month   = today.getMonth() + 1;
  let day     = today.getDate();

  if (month < 10) 
    month = "0" + month;

  if (day < 10) 
    day = "0" + day;

  let endDate = year+"-"+month+"-"+day;

  let filterDates = {"startDate":startDate,"endDate":endDate};

  DB.soldProductsCountByFilterDates(knex,filterDates).then(function(rows) { 
    mainWindow.webContents.send("Report:SaleItems",rows);
  });

});

ipcMain.on("Report:Sales", function () {

  let today   = new Date();

  let year    = today.getFullYear();
  let month   = today.getMonth() + 1;
  let day     = today.getDate(); 

  if (month < 10) 
    month = "0" + month;

  if (day < 10) 
    day = "0" + day;

  let formatedDate = year+"-"+month+"-"+day;
  let filterDates = {"startDate":formatedDate,"endDate":formatedDate};

  DB.soldProductsCountByFilterDates(knex,filterDates).then(function(rows) { 
    mainWindow.webContents.send("Report:SaleItems",rows);
  });

});

//Stock 
ipcMain.on("Report:Stock", function () {

  DB.stockProductsCount(knex).then(function(rows) { 
    mainWindow.webContents.send("Report:StockItems",rows);
  });

});

//Revanue 
ipcMain.on("Report:Revanue", function () {

  let today   = new Date();

  let year    = today.getFullYear();
  let month   = today.getMonth() + 1;
  let day     = today.getDate();

  if(month < 10) 
    month = "0" + month;

  if(day < 10) 
    day = "0" + day;

  let formatedDate = year+"-"+month+"-"+day;
  let filterDates = {"startDate":formatedDate,"endDate":formatedDate};

  DB.soldProductsByFilterDates(knex,filterDates).then(function(rows) { 
    mainWindow.webContents.send("Report:RevanueItems",rows);
  });

});

ipcMain.on("Filter:Quick:Revanue",function(evt,filter){

  // today 
  let today   = new Date();
  // date filter start from 
  let last = new Date(today.getTime() - (filter * 24 * 60 * 60 * 1000));

  let startday   = last.getDate();
  let startmonth = last.getMonth() + 1;
  let startyear  = last.getFullYear();

  if (startmonth < 10) 
    startmonth = "0" + startmonth;

  if (startday < 10) 
    startday = "0" + startday;

  let startDate = startyear+"-"+startmonth+"-"+startday;

  let year    = today.getFullYear();
  let month   = today.getMonth() + 1;
  let day     = today.getDate();

  if(month < 10) 
    month = "0" + month;

  if(day < 10) 
    day = "0" + day;

  let endDate = year+"-"+month+"-"+day;  
  let filterDates = {"startDate":startDate,"endDate":endDate};
  
  DB.soldProductsByFilterDates(knex,filterDates).then(function(rows) { 
    mainWindow.webContents.send("Report:RevanueItems",rows);
  });

});


ipcMain.on("Filter:Custom:Revanue",function(evt,filterDates){

  DB.soldProductsByFilterDates(knex,filterDates).then(function(rows) { 
    mainWindow.webContents.send("Report:RevanueItems",rows);
  });

}); 

// Database 
ipcMain.on("Export:Vendor", function () {

  DB.vendors(knex).then(function(rows){ 
    let header = "id,name,city,address,email,mobile,gstno,created_at,";        
    saveToCSV( header + prepairToCSV(rows) );
  });

});

ipcMain.on("Export:Purchase", function (evt,filterDates) {

  DB.stockProductsByFilterDates(knex,filterDates).then(function(rows) { 
    let header = "id,Product Name,Model,IMEI or SERIAL,IMEI or SERIAL,IMEI or SERIAL,Purchase Rate,Purchase On,";        
    saveToCSV( header + prepairToCSV(rows) );
  });

});

ipcMain.on("Export:Sales", function (evt,filterDates) {

  DB.soldProductsWithInvoiceByFilterDates(knex,filterDates).then(function(rows) { 
    let header = "id,Product Name,Model,IMEI or SERIAL,IMEI or SERIAL,IMEI or SERIAL,Customer Name,Customer Address,Sale Rate,Purchase Rate,Sale On,";
    saveToCSV( header + prepairToCSV(rows) );
  });

});

ipcMain.on("Export:Expance", function (evt,filterDates) {

  DB.expanceByFilterDates(knex,filterDates).then(function(rows) { 
    let header    = "id,Title,Amount,Comment,Expance On,";
    saveToCSV( header + prepairToCSV(rows) );
  });

});

ipcMain.on("Export:Product", function (evt,data) {

  DB.products(knex).then(function(rows) { 
    let header    = "id,company,model,created_at,";        
    saveToCSV( header + prepairToCSV(rows) );
  });

});

ipcMain.on("Export:Stock", function (evt,data) {

  DB.stockProducts(knex).then(function(rows) { 
    let header = "id,Product Name,Model,IMEI or SERIAL,IMEI or SERIAL,IMEI or SERIAL,Purchase Rate,Purchase On,";
    saveToCSV( header + prepairToCSV(rows) );
  });

});

ipcMain.on("Export:Revanue", function (evt,filterDates) {

  DB.soldProductRevanueByFilterDates(knex,filterDates).then(function(rows) { 
    let header = "id,Product Name,Model,IMEI or Serial,Purchase Rate,Sale Rate,Revanue,";        
    saveToCSV( header + prepairToCSV(rows) );
  });

});

ipcMain.on("Database:Backup", function () {
  
  let properties = { saveAs:true,title:"Backup Database"};

  download(BrowserWindow.getFocusedWindow(), config.dbPath,properties)
  .then(function(){});

});

ipcMain.on("Database:Restore", function () {
  
  let properties = {
    filters: [
      { name: 'Database', extensions: ['sqlite'] }
    ],
    title:'Database Restore'
  };

  dialog.showOpenDialog(BrowserWindow.getFocusedWindow(),properties,function(filename){
    
    // stop database connection
    knex.destroy().then(function(){
        // check if database file exists
        if(fs.existsSync(config.dbPath))
        {
          // delete database file 
          fs.unlink(config.dbPath,(err) => {
            if (err) {
              console.log("Error : "+ err.message);
            }else{
              // copy new database
              fs.copyFile(filename[0], config.dbPath, (err) => {
               if (err) throw err;
                // Reconnect to database
                knex = config.connectDb(config.dbClient,config.dbConn[config.dbClient]);
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Database Restored',
                    message: 'Database was Restored Successfully',
                    buttons: ['OK'],
                });
              });     
            }
          });
        }
    });
  });
});


//Setting 
ipcMain.on("ReloadView:Setting", function () { 
  createSettingWindow(); 
});

// Sales
ipcMain.on("EditView:Sale", function (evt,id) { 
  createEditSaleWindow(id); 
});

ipcMain.on("LoadWindow:Sale", function () { 
  createAddSaleWindow(); 
});

ipcMain.on("ReloadView:Sale", function () { 
  updateSale(); 
});

ipcMain.on("LoadWindow:Invoice", function (evt,id) { 
  createInvoiceWindow(id); 
});

// Purchase
ipcMain.on("EditView:Purchase", function (evt,id) { 
  createEditPurchaseWindow(id); 
});

ipcMain.on("LoadWindow:Purchase", function () { 
  createAddPurchaseWindow(); 
});

ipcMain.on("ReloadView:Purchase", function () { 
  updatePurchase(); 
});

// Expance
ipcMain.on("EditView:Expance", function (evt,id) { 
  createEditExpanceWindow(id); 
});

ipcMain.on("LoadWindow:Expance", function () { 
  createAddExpanceWindow();
});

ipcMain.on("ReloadView:Expance", function () { 
  updateExpance(); 
});

// Products
ipcMain.on("ReloadView:Product", function () { 
  updateProducts(); 
});

ipcMain.on("EditView:Product", function (evt,id) { 
  createEditProductWindow(id); 
});

ipcMain.on("LoadWindow:Product", function () { 
  createAddProductWindow(); 
});

// Vendors
ipcMain.on("ReloadView:Vendors", function () {
  updateVendors(); 
});

ipcMain.on("EditView:Vendor", function (evt,id) { 
  createEditVendorWindow(id); 
});

ipcMain.on("LoadWindow:Vendor", function () { 
  createAddVendorWindow();
});

// Dashboard
ipcMain.on("ReloadView:Dashboard", function () { 
  updateDashboard();
});

ipcMain.on("mainWindowLoaded", function () { 
  updateDashboard(); 
});


/*
****************************************************
* Database Insert Operations
****************************************************
*/

//Setting 
ipcMain.on("Edit:Setting",function(evt,payLoad){
 
  let updateData = {
    name            : payLoad.name,
    bussiness_email : payLoad.bussiness_email,
    mobile          : payLoad.mobile,
    address         : payLoad.address,
    gstno           : payLoad.gstno
  };

  DB.userUpdate(knex,updateData).then( function (result) { });

  settingWindow.close();
  updateDashboard();
});

// Sale
ipcMain.on("Delete:Sale",function(evt,id){
    dialog.showMessageBox({
        type: 'warning',
        title: 'Delete Sale',
        message: 'You are going to delete Sale',
        buttons: ['OK','Cancel'],
    },function(btnResponce){

      if(btnResponce) {
        // Click On Cancel 
        console.log("Delete Sale Cancel");
      }else{
        // Click On OK

        DB.deleteInvoiceById(knex,id).then(function() {
          
          let updateData = {
            product_status  : 1,
            sale_rate       : 0,
            sale_at         : null,
            imei_or_serial1 : '',
            imei_or_serial2 : '',
            imei_or_serial3 : ''
          };

          DB.updateStockProductById(knex,id,updateData).then(function() { 
                  dialog.showMessageBox({
                      type: 'info',
                      title: 'Deleted',
                      message: 'Sale Deleted successfully ',
                      buttons: ['OK'],
                  });
              });
           });

          updateSale();
      }    
    });

});

ipcMain.on("Add:Sale",function(evt,payLoad){

 let addInvoiceData = { 
    stock_id        : payLoad.productid,
    customer_name   : payLoad.name,
    customer_address: payLoad.address,
    customer_mobile : payLoad.mobile,
    created_at      : payLoad.sale_at
  };

  DB.insertInvoice(knex,addInvoiceData).then( function (result) { });

  let updateData = {
    sale_rate       : payLoad.sale_rate,
    product_status  : 0,
    sale_at         : payLoad.sale_at
  };

  DB.updateStockProdcutById(knex,payLoad.productid,updateData).then( function (result) { });
  
  addSaleWindow.close();
  updateSale();
});

ipcMain.on("Edit:Sale",function(evt,payLoad){
    
  let updateData = {
    sale_rate : payLoad.sale_rate,
    sale_at   : payLoad.sale_at
  };

  DB.updateStockProdcutById(knex,payLoad.productid,updateData).then( function (result) { });
  
  let invoiceData = { 
    customer_name    : payLoad.name,
    customer_address : payLoad.address,
    customer_mobile  : payLoad.mobile,
    created_at       : payLoad.sale_at
  };

  DB.updateInvoice(knex,payLoad.productid,invoiceData).then( function (result) { });

  editSaleWindow.close();
  updateSale();
});

// Purchase
ipcMain.on("Delete:Purchase",function(evt,id) {
    dialog.showMessageBox({
      type: 'warning',
      title: 'Delete Purchase',
      message: 'This Will Also Delete Related Sale And Invoice',
      buttons: ['OK','Cancel'],
    },function(btnResponce){

      if(btnResponce) {
        // Click On Cancel 
        console.log("Delete Purchase Cancel");
      }else{
        // Click On OK
        DB.deleteInvoiceById(knex,id).then(function() {
          DB.deleteStockProductById(knex,id).then(function() {
              updatePurchase();
              dialog.showMessageBox({
                  type: 'info',
                  title: 'Deleted',
                  message: 'Purchase Deleted successfully ',
                  buttons: ['OK'],
              });
          });
        });
      }    
    });
});

ipcMain.on("Add:Purchase",function(evt,payLoad){

  let insertData = {
    vendor_id       : payLoad.vendorid,
    product_id      : payLoad.productid,
    purchase_rate   : payLoad.purchase_rate,
    imei_or_serial1 : payLoad.imei_or_serial1,
    imei_or_serial2 : payLoad.imei_or_serial2,
    imei_or_serial3 : payLoad.imei_or_serial3,
    created_at      : payLoad.created_at
  };

  DB.insertStockProduct(knex,insertData).then( function (result) { });
  addPurchaseWindow.close();
  updatePurchase();
});

ipcMain.on("Edit:Purchase",function(evt,payLoad){
  
  let insertData = {
    vendor_id       : payLoad.vendor_id,
    product_id      : payLoad.product_id,
    purchase_rate   : payLoad.purchase_rate,
    imei_or_serial1 : payLoad.imei_or_serial1,
    imei_or_serial2 : payLoad.imei_or_serial2,
    imei_or_serial3 : payLoad.imei_or_serial3,
    created_at      : payLoad.created_at
  };

  DB.updateStockProdcutById(knex,payLoad.productid,insertData).then( function (result) { });
  editPurchaseWindow.close();
  updatePurchase();
});

// Expance
ipcMain.on("Delete:Expance",function(evt,id){
    dialog.showMessageBox({
        type: 'warning',
        title: 'Delete Expance',
        message: 'You are going to delete Expance',
        buttons: ['OK','Cancel'],
    },function(btnResponce){

      if(btnResponce) {
        // Click On Cancel 
        console.log("Delete Expance Cancel");
      }else{
        // Click On OK
        DB.deleteExpance(knex,id).then(function() { 
          dialog.showMessageBox({
              type: 'info',
              title: 'Deleted',
              message: 'Expance Deleted successfully ',
              buttons: ['OK'],
            });
        });
        updateExpance();
      }    
    });
});

ipcMain.on("Add:Expance",function(evt,payLoad){

  let insertData = {
    title      : payLoad.title,
    amount     : payLoad.amount,
    comment    : payLoad.comment,
    created_at : payLoad.created_at
  };

  DB.insertExpance(knex,insertData).then( function (result) { });

  addExpanceWindow.close();

  updateExpance();
});

ipcMain.on("Edit:Expance",function(evt,payLoad){
  
  let updateData = {
    title       : payLoad.title,
    amount      : payLoad.amount,
    comment     : payLoad.comment,
    created_at  : payLoad.created_at
  };

  DB.updateExpance(knex,payLoad.expanceid,updateData).then( function (result) { });
  
  editExpanceWindow.close();
  updateExpance();
});

// Vendor 
ipcMain.on("Add:Vendor",function(evt,payLoad){

  let insertData = {
    name    : payLoad.name,
    city    : payLoad.city,
    email   : payLoad.email,
    mobile  : payLoad.mobile,
    address : payLoad.address,
    gstno   : payLoad.gstno
  };

  DB.insertVendor(knex,insertData).then( function (result) { });

  addVendorWindow.close();

  updateVendors();
});

ipcMain.on("Edit:Vendor",function(evt,payLoad){
  
  let updateData = {
    name    : payLoad.name,
    city    : payLoad.city,
    email   : payLoad.email,
    mobile  : payLoad.mobile,
    address : payLoad.address,
    gstno   : payLoad.gstno
  };

  DB.updateVendor(knex,payLoad.vendorid,updateData).then( function (result) { });
  editVendorWindow.close();
  updateVendors();
});


// Product 
ipcMain.on("Add:Product",function(evt,payLoad){

  let insertData = {
    company : payLoad.company,
    model   : payLoad.model
  };

  DB.insertProduct(knex,insertData).then( function (result) { });

  addProductWindow.close();

  updateProducts();
});

ipcMain.on("Edit:Product",function(evt,payLoad){

  let updateData = {
    company : payLoad.company,
    model   : payLoad.model
  };

  DB.updateProduct(knex,payLoad.productid,updateData).then( function (result) { });
  
  editProductWindow.close();
  
  updateProducts();
});


/*
*************************************
* Functions
*************************************
*/

function updatePurchase() {  
  DB.purchase(knex).then(function(rows){ 
    // Send Data To Main Window
    mainWindow.webContents.send("Add:PurchaseItems",rows);
  });
}

function updateSale() {
  DB.sales(knex).then(function(rows) { 
    mainWindow.webContents.send("Add:SaleItems",rows);
  });
}

function updateExpance() {
   // Current Month Expance 
  DB.expance(knex).then(function(rows){ 
      // Send Data To Main Window
      mainWindow.webContents.send("Add:ExpanceItems",rows);
  });
}

function updateVendors() {
  DB.vendors(knex).then(function(rows){ 
      // Send Data To Main Window
      mainWindow.webContents.send("Add:VendorsItems",rows);
  });
}

function updateProducts() {
   // Current Month Expance 
  DB.products(knex).then(function(rows){ 
      // Send Data To Main Window
      mainWindow.webContents.send("Add:ProductsItems",rows);
  });
}

function updateDashboard(){
  
  // Update Seetings
  DB.user(knex).then(function(row) {
      mainWindow.setTitle(row.name);
      mainWindow.webContents.send("Settings:Update",row);
  });

  // In Stock Product Count
  DB.inStockProductCount(knex,{ stockCount: '*' }).then(function(rows){ 
    // Send Data To Main Window
    mainWindow.webContents.send("updateDashboard",{
      "elementData":rows[0].stockCount,
      "elementId":"instockproduct"
    });
  })  

  // In Stock Products Amount Sum 
  DB.stockAmount(knex,{stockCount:'purchase_rate'}).then(function(rows) { 
     
     if(rows[0].stockCount == null)
        rows[0].stockCount = 0; 
    // Send Data To Main Window
    mainWindow.webContents.send("updateDashboard",{
      "elementData":rows[0].stockCount,
      "elementId":"stockAmount"
    });
  })

  // Product Sales Count
  DB.salesCount(knex,{ stockCount: '*' }).then(function(rows){ 
    // Send Data To Main Window
    mainWindow.webContents.send("updateDashboard",{
      "elementData":rows[0].stockCount,
      "elementId":"totalSales"
    });
  })

  // Product Sales Amount
  DB.saleAmount(knex,{stockCount:'sale_rate'}).then(function(rows) { 
    
    if(rows[0].stockCount == null)
        rows[0].stockCount = 0; 
    // Send Data To Main Window
    mainWindow.webContents.send("updateDashboard",{
      "elementData":rows[0].stockCount,
      "elementId":"salesAmount"
    });
  })

  // Current Month Expance 
  DB.expance(knex).then(function(rows){ 
    let totalExpance = 0 ;
    var today        = new Date();
    rows.forEach(function(row) {
      let expanceDate = new Date(row.created_at);
      expancemonth    = expanceDate.getMonth();
      expanceyear     = expanceDate.getYear();
      
      if( expancemonth == today.getMonth() && expanceyear == today.getYear()  )
        totalExpance = parseInt(totalExpance,10) + parseInt(row.amount,10);
    });
    
    // Send Data To Main Window
    mainWindow.webContents.send("updateDashboard",{
      "elementData":totalExpance,
      "elementId":"currentMonthExpance"
    });
  })

  // Current Month Sales And Loss/Profit
  DB.saleData(knex).then(function(rows) { 
    var today = new Date();
    var currentMonthPurchaseAmount = 0;
    var currentMonthSaleAmount     = 0;
    var currentMonthSales          = 0;
    var currentMonthRevanue        = 0;

    rows.forEach(function(row) {

      let saleDate = new Date(row.sale_at);
      salemonth    = saleDate.getMonth();
      saleyear     = saleDate.getYear();
      
      if( salemonth == today.getMonth() && saleyear == today.getYear()  ){
          currentMonthPurchaseAmount = parseInt(currentMonthPurchaseAmount,10) + parseInt(row.purchase_rate,10);
          currentMonthSaleAmount     = parseInt(currentMonthSaleAmount,10) + parseInt(row.sale_rate,10);  
          currentMonthSales++;        
      }
    });

    if( currentMonthPurchaseAmount < currentMonthSaleAmount )
    {
      currentMonthRevanue = parseInt(currentMonthSaleAmount,10) - parseInt(currentMonthPurchaseAmount,10);
      currentMonthRevanue = currentMonthRevanue + " Profit";
    }
    else{ 
      currentMonthRevanue = parseInt(currentMonthPurchaseAmount,10) - parseInt(currentMonthSaleAmount,10);
      currentMonthRevanue = currentMonthRevanue+" Loss";
    }

    // Send Data To Main Window
    mainWindow.webContents.send("updateDashboard",{
      "elementData":currentMonthSales,
      "elementId":"currentMonthSales"
    });

    // Send Data To Main Window
    mainWindow.webContents.send("updateDashboard",{
      "elementData":currentMonthRevanue,
      "elementId":"currentMonthRevanue"
    });      
  });
}

/* Save Export Data To CSV File */
function saveToCSV(data) {
  dialog.showSaveDialog(
      {
        defaultPath: `C:\\Users\\${process.env.USERNAME}\\Documents\\`,
        filters: [{name: 'csv',extensions: ['csv'],}, ],
      },
      (filename) => {
            
          if (filename === undefined) 
            return;
              
          fs.writeFile(filename, data, (error) => {
            if (error) {
              dialog.showErrorBox('Export Failed',`An error occured saving the file ${error.message}`,);
              return;
            }
            dialog.showMessageBox({
                type: 'none',
                title: 'Database Export',
                message: 'Export Was Successfully Saved',
                buttons: ['OK'],
            });
          });
      });    
}

/* Prepair Data in to CSV Format */
function prepairToCSV(rows){
  let data = "\n";
        
  rows.forEach(function(row) {  
    let line = '';
    // Object to Array 
    let rowAsArray = Object.values(row)

    rowAsArray.forEach(function(value) { 
      if( !isNaN(parseFloat(value)) && isFinite(value) )
        line = line + value+",";
      else if(value != null )
        line = line + value.replace(",", " ") + ",";
      else
        line = line + ",";  
    });

    // Append line to data 
    data = data + line + "\n"; 
  });
  return data;

}