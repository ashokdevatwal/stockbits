ipc.on("LoadData:Invoice",function(evt,data) {

	document.getElementById('footerTag').innerHTML 			= "Digital Invoice Development : ARS Technologies - Alwar";
	
	document.getElementById('waterMark').innerHTML 			= data.userData.name;
	document.getElementById('bussinessName').innerHTML 		= data.userData.name;
	document.getElementById('bussinessAddress').innerHTML 	= data.userData.address;

	document.getElementById('customerName').innerHTML 		= data.row.customer_name;
	document.getElementById('customerAddress').innerHTML 	= data.row.customer_address;
	document.getElementById('customerMobile').innerHTML 	= data.row.customer_mobile;

	document.getElementById('invoiceNumber').innerHTML 		= data.row.id;
	document.getElementById('invoiceDate').innerHTML 		= data.row.sale_at;

	document.getElementById('productName').innerHTML 		= data.row.product_name+"-"+data.row.model;
	document.getElementById('serial1').innerHTML 			= data.row.imei_or_serial1;
	document.getElementById('serial2').innerHTML 			= data.row.imei_or_serial2;
	document.getElementById('serial3').innerHTML 			= data.row.imei_or_serial3;

	document.getElementById('amount1').innerHTML 			= data.row.sale_rate;
	document.getElementById('amount2').innerHTML 			= data.row.sale_rate;
	document.getElementById('amount3').innerHTML 			= data.row.sale_rate;

	document.getElementById('authName').innerHTML 			= data.userData.name;

	document.getElementById('invoiceGST').innerHTML 		= data.userData.gstno;

	window.print();

});