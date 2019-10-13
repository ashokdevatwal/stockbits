const form = document.querySelector('#editSettingForm');

if(form) {
	form.addEventListener('submit',submitForm);

	function submitForm(e) {
		e.preventDefault();

		let payLoad = {
			name			:'',
			bussiness_email	:'',
			mobile			:'',
			address			:'',
			gstno			:''
		};

		payLoad.name 			= document.querySelector("#name").value;
		payLoad.bussiness_email = document.querySelector("#bemail").value;
		payLoad.address 		= document.querySelector("#address").value;
		payLoad.gstno 			= document.querySelector("#gstno").value;
	 	payLoad.mobile 			= document.querySelector("#mobile").value;

		ipc.send("Edit:Setting",payLoad);
	}
}

ipc.on("LoadData:User",function(evt,payLoad) {
	document.querySelector("#name").value 		= payLoad.name;
	document.querySelector("#bemail").value 	= payLoad.bussiness_email;
	document.querySelector("#address").value 	= payLoad.address;
	document.querySelector("#gstno").value 		= payLoad.gstno;
	document.querySelector("#mobile").value 	= payLoad.mobile;
});
