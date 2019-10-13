/* Select Vendor */
ipc.on("Select:Vendor", function(evt, rows) {
	 
	 let select = document.createElement('select');
	 select.setAttribute("class", "form-control");
	 select.setAttribute("id", "vendor");

	 let optionDefault = document.createElement('option');
	 let defaultText = document.createTextNode("Select Vendor");
	 optionDefault.setAttribute("value", "default");	 
	 optionDefault.appendChild(defaultText);
	 select.appendChild(optionDefault);

	 rows.forEach(function(row) {
	 	let option = document.createElement('option');
	 	let textnode = document.createTextNode(row.name);
		option.setAttribute("value",row.id);
		option.appendChild(textnode);
		select.appendChild(option);
	 });

	let injectSpace =  document.getElementById('vendorInject');
   
    injectSpace.appendChild(select);
   
});

/* Select Product */
ipc.on("Select:Product", function(evt, rows) {
	 
	 let select = document.createElement('select');
	 select.setAttribute("class", "form-control");
	 select.setAttribute("id", "product");

	 let optionDefault = document.createElement('option');
	 let defaultText = document.createTextNode("Select Product");
	 optionDefault.setAttribute("value", "default");	 
	 optionDefault.appendChild(defaultText);
	 select.appendChild(optionDefault);
	 
	 rows.forEach(function(row) {
	 	let option = document.createElement('option');
	 	let textnode = document.createTextNode(row.company+"-"+row.model);
		option.setAttribute("value",row.id);
		option.appendChild(textnode);
		select.appendChild(option);
	 });

	let injectSpace =  document.getElementById('productInject');
   
    injectSpace.appendChild(select);
   
});


const form = document.querySelector('#addPurchaseForm');

if(form) {
	form.addEventListener('submit',submitForm);

	function submitForm(e) {
		e.preventDefault();

		let payLoad = {
			vendorid		:'',
			productid		:'',
			purchase_rate	:'',
			imei_or_serial1	:'',
			imei_or_serial2	:'',
			imei_or_serial3	:'',
			created_at		:''
		};

		payLoad.vendorid		= document.querySelector("#vendor").value;
		payLoad.productid		= document.querySelector("#product").value;
		payLoad.purchase_rate	= document.querySelector("#rate").value;
		payLoad.imei_or_serial1	= document.querySelector("#imei_or_serial1").value;
		payLoad.imei_or_serial2	= document.querySelector("#imei_or_serial2").value;
		payLoad.imei_or_serial3	= document.querySelector("#imei_or_serial3").value;
		payLoad.created_at  	= document.querySelector("#pdate").value;

		ipc.send("Add:Purchase",payLoad);
	}
}

const editform = document.querySelector('#editPurchaseForm');

if(editform) {
	editform.addEventListener('submit',submiteditForm);

	function submiteditForm(e) {
		e.preventDefault();

		let payLoad = {
			productid		:'',
			vendor_id		:'',
			product_id		:'',
			purchase_rate	:'',
			imei_or_serial1	:'',
			imei_or_serial2	:'',
			imei_or_serial3	:'',
			created_at		:''
		};

	payLoad.productid 		= document.getElementById("productid").value;
	payLoad.vendor_id 		= document.getElementById("vendor").value;
	payLoad.product_id 		= document.getElementById("product").value;
	payLoad.purchase_rate 	= document.querySelector("#rate").value;
	payLoad.imei_or_serial1 = document.querySelector("#imei_or_serial1").value 	;
	payLoad.imei_or_serial2 = document.querySelector("#imei_or_serial2").value;
	payLoad.imei_or_serial3 = document.querySelector("#imei_or_serial3").value;
	payLoad.created_at 		= document.querySelector("#pdate").value;

	ipc.send("Edit:Purchase",payLoad);
	}
}

ipc.on("LoadEdit:Purchase",function(evt,payLoad) {
	
	document.getElementById("productid").value			= payLoad.id;
	document.getElementById("vendor").selectedIndex		= payLoad.vendor_id;
	document.getElementById("product").selectedIndex	= payLoad.product_id;
	document.querySelector("#rate").value 				= payLoad.purchase_rate;
	document.querySelector("#imei_or_serial1").value 	= payLoad.imei_or_serial1;
	document.querySelector("#imei_or_serial2").value 	= payLoad.imei_or_serial2;
	document.querySelector("#imei_or_serial3").value 	= payLoad.imei_or_serial3;
	document.querySelector("#pdate").value 				= payLoad.created_at;
});
