const form = document.querySelector('#addVendorForm');

if(form) {
	form.addEventListener('submit',submitForm);

	function submitForm(e) {
		e.preventDefault();

		let payLoad = {name:'',city:'',email:'',mobile:'',address:'',gstno:''};

		payLoad.name  		= document.querySelector("#name").value;
		payLoad.city  		= document.querySelector("#city").value;
		payLoad.email  		= document.querySelector("#email").value;
		payLoad.mobile  	= document.querySelector("#mobile").value;
		payLoad.address  	= document.querySelector("#address").value;
		payLoad.gstno	  	= document.querySelector("#gstno").value;

		ipc.send("Add:Vendor",payLoad);

	}
}

const editform = document.querySelector('#editVendorForm');

if(editform) {
	editform.addEventListener('submit',submiteditForm);

	function submiteditForm(e) {
		e.preventDefault();

		let payLoad = {name:'',city:'',email:'',mobile:'',address:'',gstno:'',vendorid:''};

		payLoad.name  		= document.querySelector("#name").value;
		payLoad.city  		= document.querySelector("#city").value;
		payLoad.email  		= document.querySelector("#email").value;
		payLoad.mobile  	= document.querySelector("#mobile").value;
		payLoad.address  	= document.querySelector("#address").value;
		payLoad.gstno	  	= document.querySelector("#gstno").value;
		payLoad.vendorid  	= document.querySelector("#vendorid").value;

		ipc.send("Edit:Vendor",payLoad);

	}
}

ipc.on("LoadEdit:Vendor",function(evt,payLoad) {
	document.querySelector("#vendorid").value 	=  payLoad.id;
	document.querySelector("#name").value 		= payLoad.name;
	document.querySelector("#city").value 		= payLoad.city;
	document.querySelector("#email").value 		= payLoad.email;
	document.querySelector("#mobile").value 	= payLoad.mobile;
	document.querySelector("#address").value 	= payLoad.address;
	document.querySelector("#gstno").value 		= payLoad.gstno;
});
