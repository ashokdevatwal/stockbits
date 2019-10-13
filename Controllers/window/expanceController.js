
const form = document.querySelector('#addExpanceForm');

if(form) {
	form.addEventListener('submit',submitForm);

	function submitForm(e) {
		e.preventDefault();

		let payLoad = {title:'',amount:'',comment:'',created_at:''};

		payLoad.title  		= document.querySelector("#title").value;
		payLoad.amount  	= document.querySelector("#amount").value;
		payLoad.comment  	= document.querySelector("#comment").value;
		payLoad.created_at  = document.querySelector("#expancedate").value;

		ipc.send("Add:Expance",payLoad);

	}
}

const editform = document.querySelector('#editExpanceForm');

if(editform) {
	editform.addEventListener('submit',submiteditForm);

	function submiteditForm(e) {
		e.preventDefault();

		let payLoad = {title:'',amount:'',comment:'',created_at:'',expanceid:''};

		payLoad.title  		= document.querySelector("#title").value;
		payLoad.amount  	= document.querySelector("#amount").value;
		payLoad.comment  	= document.querySelector("#comment").value;
		payLoad.created_at  = document.querySelector("#expancedate").value;
		payLoad.expanceid	= document.querySelector("#expanceid").value;
		ipc.send("Edit:Expance",payLoad);

	}
}

ipc.on("LoadEdit:Expance",function(evt,payLoad){
	document.querySelector("#expanceid").value 		= payLoad.id;
	document.querySelector("#title").value 			= payLoad.title;
	document.querySelector("#amount").value 		= payLoad.amount;
	document.querySelector("#comment").value 		= payLoad.comment;
	document.querySelector("#expancedate").value 	= payLoad.created_at;
});
