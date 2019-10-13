/*
***********************************************
***           Report Data In UI             ***
***********************************************
*/
// Revanue 
ipc.on("Report:RevanueItems",function(evt,rows){
    let DataTable = $('#revanuereport-listing').DataTable();
    let totalRevanue = 0 ;
    DataTable.clear().draw();

    rows.forEach(function(row) {
      
      let productRevanue = row.sale_rate - row.purchase_rate;

      if( productRevanue < 0 ){
        totalRevanue = totalRevanue - (productRevanue * -1);
        productRevanue ="<span style='color:red;font-weight:600'>"+ (productRevanue*-1) + " Loss</span>"; 
      }
      else if( productRevanue > 0 ){
        totalRevanue = totalRevanue + productRevanue;
        productRevanue = productRevanue + " Profit";
      }
      else
        productRevanue = "Null";

      DataTable.row.add( [
        row.product+" => "+row.model,
        row.purchase_rate,
        row.sale_rate,
        productRevanue        
    ] ).node().id = row.id;

    DataTable.draw( false );;

    });

if( totalRevanue > 0 )
    document.getElementById('totalRevanueAmount').innerHTML = "Total Revanue : "+totalRevanue+" Profit";
else if( totalRevanue < 0 )
    document.getElementById('totalRevanueAmount').innerHTML = "Total Revanue : "+totalRevanue * -1+" Loss";
else
    document.getElementById('totalRevanueAmount').innerHTML = "Total Revanue : "+totalRevanue;

});

// Stock
ipc.on("Report:StockItems",function(evt,rows){
    let DataTable = $('#stockreport-listing').DataTable();
    
    DataTable.clear().draw();

    rows.forEach(function(row) {
      
      DataTable.row.add( [
        row.product,
        row.model,
        row.sales
    ] ).node().id = row.id;

    DataTable.draw( false );;

    });
});

// Sales 
ipc.on("Report:SaleItems",function(evt,rows){
    let DataTable = $('#salereport-listing').DataTable();
    
    DataTable.clear().draw();

    rows.forEach(function(row) {
      
      DataTable.row.add( [
        row.product,
        row.model,
        row.sales
    ] ).node().id = row.id;

    DataTable.draw( false );;

    });

});

/*
***********************************************
***           List Data In UI               ***
***********************************************
*/

// Sales
ipc.on("Add:SaleItems",function(evt,rows){
    let DataTable = $('#sale-listing').DataTable();
    
    DataTable.clear().draw();

    rows.forEach(function(row) {
      
      DataTable.row.add([
        row.id,
        row.customer_name,
        row.product_name+"-"+row.model,
        row.sale_rate,
        row.sale_at,
        "<button class='badge badge-success action-btn' onclick='genrateInvoice("+row.id+")'>Invoice</button>"
        +"&nbsp;"+
        "<button class='badge badge-warning action-btn' onclick='editSale("+row.id+")'>Edit</button>"
        +"&nbsp;"+
        "<button class='badge badge-danger action-btn' onclick='deleteSale("+row.id+")'><i class='fa fa-trash'></i></button>"
    ]).node().id = row.id;

    DataTable.draw( false );;

    });

});

// Purchase
ipc.on("Add:PurchaseItems",function(evt,rows){
    let DataTable = $('#purchase-listing').DataTable();
    
    DataTable.clear().draw();

    rows.forEach(function(row) {
      let lable = '';
      if (row.product_status == 1 )
        lable = "<label class='badge badge-success action-btn'>In Stock</label>";   
      else 
        lable = "<label class='badge badge-danger action-btn'>Sold</label>";   
        
      DataTable.row.add( [
        row.id,
        row.vendor_name,
        row.product_name+"-"+row.model,
        row.purchase_rate,
        row.imei_or_serial1,
        lable,
        "<button class='badge badge-warning action-btn' onclick='editPurchase("+row.id+")'>Edit</button>"
        +"&nbsp;"+
        "<button class='badge badge-danger action-btn' onclick='deletePurchase("+row.id+")'><i class='fa fa-trash'></i></button>"
    ] ).node().id = row.id;

    DataTable.draw( false );;

    });

});


// Product
ipc.on("Add:ProductsItems",function(evt,rows){
    let DataTable = $('#product-listing').DataTable();
    
    DataTable.clear().draw();

    rows.forEach(function(row) {
      
      DataTable.row.add( [
        row.id,
        row.company,
        row.model,
        "<button class='badge badge-warning action-btn' onclick='editProduct("+row.id+")'>Edit</button>"
    ] ).node().id = row.id;

    DataTable.draw( false );;

    });

});

// Expance
ipc.on("Add:ExpanceItems",function(evt,rows){
    let DataTable = $('#expance-listing').DataTable();
    
    DataTable.clear().draw();

    rows.forEach(function(row) {
      
      DataTable.row.add( [
        row.id,
        row.title,
        row.amount,
        row.comment,
        row.created_at,
        "<button class='badge badge-warning action-btn' onclick='editExpance("+row.id+")'>Edit</button>"
        +"&nbsp;"+
        "<button class='badge badge-danger action-btn' onclick='deleteExpance("+row.id+")'><i class='fa fa-trash'></i></button>"
    ] ).node().id = row.id;

    DataTable.draw( false );;

    });

});

// Vendor
ipc.on("Add:VendorsItems",function(evt,rows){
    let DataTable = $('#vendor-listing').DataTable();
    
    DataTable.clear().draw();

    rows.forEach(function(row) {
      
      DataTable.row.add( [
        row.id,
        row.name,
        row.city,
        row.email,
        row.mobile,
        row.address,
        row.gstno,
        "<button class='badge badge-warning action-btn' onclick='editVendor("+row.id+")'>Edit</button>"
        
    ] ).node().id = row.id;

    DataTable.draw( false );;

    });

});


/* 
***********************************************
***             Tabs Action                 ***
***********************************************
*/

// Logout
function logout() {
    ipc.send("Logout");
}

/************ Dashboard ******************/

ipc.on("Settings:Update",function(evt,row) { 
    document.getElementById("business-name").innerHTML = row.name;
});

ipc.on("updateDashboard", function(evt, result) {
    let resultEl = document.getElementById(result.elementId.toString());
    resultEl.innerHTML = result.elementData;
});

function dashboardView() { 
    activateIndex('dashboardIndex');
    showContentWrapper('dashboardContentWrapper');
    ipc.send("ReloadView:Dashboard");
}

/************ Settings ******************/

function settingView() {
    activateIndex('settingIndex');
    ipc.send("ReloadView:Setting");
}

/************ Database ******************/

function databaseView() {
    activateIndex('databaseIndex');
    showContentWrapper('databaseContentWrapper');
}

function exportView() {
    activateIndex('databaseIndex');
    showContentWrapper('exportContentWrapper');
}
// Export 
function exportVendor() { ipc.send("Export:Vendor"); }

function exportProduct() { ipc.send("Export:Product"); }

function exportStock() { ipc.send("Export:Stock"); }

function exportPurchase() {
    $('#purchaseModel').modal("hide");

    let startDate = document.getElementById('purchaseStartDate').value;
    let endDate = document.getElementById('purchaseEndDate').value;

    document.getElementById('purchaseStartDate').value = null;
    document.getElementById('purchaseEndDate').value = null;

    ipc.send("Export:Purchase",{"startDate":startDate,"endDate":endDate});
}

function exportSales() {
    $('#salesModel').modal("hide");

    let startDate = document.getElementById('saleStartDate').value;
    let endDate = document.getElementById('saleEndDate').value;

    document.getElementById('saleStartDate').value = null;
    document.getElementById('saleEndDate').value = null;

    ipc.send("Export:Sales",{"startDate":startDate,"endDate":endDate});
}

function exportExpance() {
    $('#expanceModel').modal("hide");

    let startDate = document.getElementById('expanceStartDate').value;
    let endDate = document.getElementById('expanceEndDate').value;

    document.getElementById('expanceStartDate').value = null;
    document.getElementById('expanceEndDate').value = null;

    ipc.send("Export:Expance",{"startDate":startDate,"endDate":endDate});
}

function exportRevanue() {
    $('#revanueModel').modal("hide");

    let startDate = document.getElementById('revanueStartDate').value;
    let endDate = document.getElementById('revanueEndDate').value;

    document.getElementById('revanueStartDate').value = null;
    document.getElementById('revanueEndDate').value = null;

    ipc.send("Export:Revanue",{"startDate":startDate,"endDate":endDate});
}
//Database
function restoreDatabase(){ ipc.send("Database:Restore"); }

function backupDatabase(){ ipc.send("Database:Backup"); }


/************ Report ******************/

function reportView() {
    activateIndex('reportIndex');
    showContentWrapper('reportContentWrapper'); 
}
// Sales
function salesReportView() {
    activateIndex('reportIndex');
    document.getElementById("salesQuickFilter").selectedIndex = 1;
    showContentWrapper('saleReportContentWrapper');
    ipc.send("Report:Sales");
}

function salesCustomFilter() {
    document.getElementById("salesQuickFilter").selectedIndex = 0;
    let startDate = document.getElementById("salesStartDate").value;
    let endDate   = document.getElementById("salesEndDate").value;
    ipc.send("Filter:Custom:Sales",{"startDate":startDate,"endDate":endDate});
}

function salesQuickFilter() {
    let filter = document.getElementById("salesQuickFilter").value;

    document.getElementById("salesStartDate").value = null;
    document.getElementById("salesEndDate").value = null;

    if (filter != 0 ) {
        ipc.send("Filter:Quick:Sales",filter);       
    }else
      alert("Fill Dates For Custom Filter");      
}

// Stock
function stockReportView() {
    activateIndex('reportIndex');
    showContentWrapper('stockReportContentWrapper');
    ipc.send("Report:Stock");      
}

// Revanue 
function revanueReportView() {
    activateIndex('reportIndex');
    document.getElementById("revanueQuickFilter").selectedIndex = 1;
    showContentWrapper('revanueReportContentWrapper');
    ipc.send("Report:Revanue");
}

function revanueQuickFilter() {
    let filter = document.getElementById("revanueQuickFilter").value;

    document.getElementById("revanueStartDate").value = null;
    document.getElementById("revanueEndDate").value = null;

    if (filter != 0 ) {
        ipc.send("Filter:Quick:Revanue",filter);       
    }else
      alert("Fill Dates For Custom Filter");      
}

function revanueCustomFilter() {
    document.getElementById("revanueQuickFilter").selectedIndex = 0;
    let startDate = document.getElementById("revanueStartDate").value;
    let endDate   = document.getElementById("revanueEndDate").value;
    ipc.send("Filter:Custom:Revanue",{"startDate":startDate,"endDate":endDate});
}


/************ Sales ******************/

function saleView() {
    activateIndex('saleIndex');
    showContentWrapper('saleContentWrapper');
    ipc.send("ReloadView:Sale");
}

function deleteSale(id) { ipc.send("Delete:Sale",id); }

function addSaleWindow() { ipc.send("LoadWindow:Sale");  }

function editSale(id) { ipc.send("EditView:Sale",id); }

function genrateInvoice(id) { ipc.send("LoadWindow:Invoice",id); }

/************ Purchase ******************/

function purchaseView() {
    activateIndex('purchaseIndex');
    showContentWrapper('purchaseContentWrapper');
    ipc.send("ReloadView:Purchase");
}

function deletePurchase(id) { ipc.send("Delete:Purchase",id); }

function addPurchaseWindow() { ipc.send("LoadWindow:Purchase");  }

function editPurchase(id) { ipc.send("EditView:Purchase",id); }

/************ Product ******************/

function productsView() {
    activateIndex('productIndex');
    showContentWrapper('productsContentWrapper');
    ipc.send("ReloadView:Product");
}

function addProductWindow() { ipc.send("LoadWindow:Product");  }

function editProduct(id) { ipc.send("EditView:Product",id); }

/************ Vendor ******************/

function vendorsView() { 
    activateIndex('vendorIndex');
    showContentWrapper('vendorsContentWrapper');
    ipc.send("ReloadView:Vendors");
}

function addVendorWindow()  { ipc.send("LoadWindow:Vendor");  }

function editVendor(id)     { ipc.send("EditView:Vendor",id); }

/************ Expance ******************/

function expanceView() { 
    activateIndex('expanceIndex');
    showContentWrapper('expanceContentWrapper');
    ipc.send("ReloadView:Expance");
}

function deleteExpance(id) { ipc.send("Delete:Expance",id); }

function editExpance(id)    { ipc.send("EditView:Expance",id); }

function addExpanceWindow() { ipc.send("LoadWindow:Expance");  }


/*
************************************************************
*                   Helper Functions 
************************************************************
*/

function activateIndex(id) {
    deactivateAllIndex();
    document.getElementById(id).classList.add('activetab');
}

function deactivateAllIndex() {
    document.getElementById('dashboardIndex').classList.remove('activetab');
    document.getElementById('vendorIndex').classList.remove('activetab');
    document.getElementById('saleIndex').classList.remove('activetab');
    document.getElementById('purchaseIndex').classList.remove('activetab');
    document.getElementById('reportIndex').classList.remove('activetab');
    document.getElementById('expanceIndex').classList.remove('activetab');   
    document.getElementById('productIndex').classList.remove('activetab');   
    document.getElementById('settingIndex').classList.remove('activetab');   
    document.getElementById('databaseIndex').classList.remove('activetab');   
}

function showContentWrapper(id) {
    hideAllContentWrapper();
    document.getElementById(id).style = "display:block";
}

function hideAllContentWrapper() {
	document.getElementById('dashboardContentWrapper').style       = "display:none";
	document.getElementById('expanceContentWrapper').style         = "display:none";
    document.getElementById('vendorsContentWrapper').style         = "display:none";
    document.getElementById('productsContentWrapper').style        = "display:none";
    document.getElementById('purchaseContentWrapper').style        = "display:none";
    document.getElementById('saleContentWrapper').style            = "display:none";
    document.getElementById('reportContentWrapper').style          = "display:none";
    document.getElementById('saleReportContentWrapper').style      = "display:none";
    document.getElementById('databaseContentWrapper').style        = "display:none";
    document.getElementById('exportContentWrapper').style          = "display:none";
    document.getElementById('stockReportContentWrapper').style     = "display:none";
    document.getElementById('revanueReportContentWrapper').style   = "display:none";
}


/*
*************************************************************
*   System Date And Time 
*************************************************************
*/
    
function startTime() {
    let today   = new Date();
    let h       = today.getHours();
    let m       = today.getMinutes();
    let s       = today.getSeconds();
    m           = checkTime(m);
    s           = checkTime(s);
    
    document.getElementById('hour').innerHTML = h;
    document.getElementById('min').innerHTML = m;
    document.getElementById('sec').innerHTML = s;
    let t = setTimeout(startTime, 500);
}

function checkTime(i) { 
    if (i < 10) 
        i = "0" + i;
    return i;
}

/* Date */
function startDate() {
    let today   = new Date();
    let year    = today.getFullYear();
    let month   = today.getMonth();
    let day     = today.getDate();
    let weekday = today.getDay();
    let months  = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days    = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    document.getElementById('weekday').innerHTML = days[weekday];
    document.getElementById('day').innerHTML = day;
    document.getElementById('month').innerHTML = months[month];
    document.getElementById('year').innerHTML = year;

    // Dashboard Mini Report 
    document.getElementById('salesMonth').innerHTML = months[month];
    document.getElementById('expanceMonth').innerHTML = months[month];
    // Copyright Year
    document.getElementById('cpyear').innerHTML = year;

    let t = setTimeout(startDate, 500*60*60);
}