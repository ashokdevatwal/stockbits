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
	 	let text = '';

	 	if( row.imei_or_serial1 == null )
			text = row.product_name+"-"+row.model;
	 	else
	 		text = row.product_name+"-"+row.model+" ["+row.imei_or_serial1+"]";

	 	let textnode = document.createTextNode(text);
		option.setAttribute("value",row.id);
		option.appendChild(textnode);
		select.appendChild(option);
	 });

	let injectSpace =  document.getElementById('productInject');
   
    injectSpace.appendChild(select);
   
});

/* Set Product */
ipc.on("Set:Product", function(evt, row) {
	
	let label = document.querySelector("#productlabel");
	
	if( row.imei_or_serial1 == null )
		label.innerHTML = row.product_name+"-"+row.model;
	else
		label.innerHTML = row.product_name+"-"+row.model+" ["+row.imei_or_serial1+"]";
   
});


const form = document.querySelector('#addSaleForm');

if(form) {
	form.addEventListener('submit',submitForm);

	function submitForm(e) {
		e.preventDefault();

		let payLoad = {
			productid	:'',
			name		:'',
			address		:'',
			mobile		:'',
			sale_rate	:'',
			sale_at 	:''
		};

		payLoad.productid	= document.querySelector("#product").value;
		payLoad.name		= document.querySelector("#name").value;
		payLoad.address		= document.querySelector("#address").value;
		payLoad.mobile		= document.querySelector("#mobile").value;
		payLoad.sale_rate	= document.querySelector("#salecost").value;
		payLoad.sale_at  	= document.querySelector("#pdate").value;

		ipc.send("Add:Sale",payLoad);
	}
}

const editform = document.querySelector('#editSaleForm');

if(editform) {
	editform.addEventListener('submit',submiteditForm);

	function submiteditForm(e) {
		e.preventDefault();

		let payLoad = {
			productid	:'',
			name		:'',
			address		:'',
			mobile		:'',
			sale_rate	:'',
			sale_at 	:''
		};

		payLoad.productid	= document.querySelector("#productid").value;
		payLoad.name		= document.querySelector("#name").value;
		payLoad.address		= document.querySelector("#address").value;
		payLoad.mobile		= document.querySelector("#mobile").value;
		payLoad.sale_rate	= document.querySelector("#salecost").value;
		payLoad.sale_at  	= document.querySelector("#pdate").value;

	ipc.send("Edit:Sale",payLoad);
	}
}

ipc.on("LoadEdit:Sale",function(evt,payLoad) {
	document.querySelector("#productid").value			= payLoad.id;
	document.querySelector("#name").value 				= payLoad.customer_name;
	document.querySelector("#address").value 			= payLoad.customer_address;
	document.querySelector("#mobile").value 			= payLoad.customer_mobile;
	document.querySelector("#salecost").value 			= payLoad.sale_rate;
	document.querySelector("#pdate").value 				= payLoad.sale_at;
});
