
const form = document.querySelector('#addProductForm');

if(form) {
	form.addEventListener('submit',submitForm);

	function submitForm(e) {
		e.preventDefault();

		let payLoad = {company:'',model:''};

		payLoad.company	= document.querySelector("#company").value;
		payLoad.model  	= document.querySelector("#model").value;

		ipc.send("Add:Product",payLoad);
	}
}

const editform = document.querySelector('#editProductForm');

if(editform) {
	editform.addEventListener('submit',submiteditForm);

	function submiteditForm(e) {
		e.preventDefault();

		let payLoad = {company:'',model:'',productid:''};

		payLoad.company		= document.querySelector("#company").value;
		payLoad.model  		= document.querySelector("#model").value;
		payLoad.productid	= document.querySelector("#productid").value;
		ipc.send("Edit:Product",payLoad);
	}
}

ipc.on("LoadEdit:Product",function(evt,payLoad){
	document.querySelector("#productid").value 		= payLoad.id;
	document.querySelector("#company").value 		= payLoad.company;
	document.querySelector("#model").value 			= payLoad.model;
});
