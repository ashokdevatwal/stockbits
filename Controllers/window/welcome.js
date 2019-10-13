const form = document.querySelector('#installationForm');

if(form) {
	form.addEventListener('submit',submitForm);

	function submitForm(e) {
		e.preventDefault();

		if( isFormDataValid() ) {

			let payLoad = {
				name			:'',
				bussiness_email	:'',
				address			:'',
				password		:''
			};

			payLoad.name 			= document.querySelector("#bussinessName").value;
			payLoad.bussiness_email = document.querySelector("#bussinessEmail").value;
			payLoad.address 		= document.querySelector("#address").value;
			payLoad.password		= document.querySelector("#password").value;
		
			ipc.send("Save:User",payLoad);
		}
		 
	}
}

function isFormDataValid() {
	
	resetErrors();

	let allValid = true;
	let bussinessName = document.querySelector("#bussinessName").value;
	let password 	  = document.querySelector("#password").value;
	let cpassword 	  = document.querySelector("#cpassword").value;

	if( bussinessName.length <= 0 ){
		allValid = false;
		document.getElementById('errorName').style = "display:block";
		document.getElementById('errorName').innerHTML ="Bussiness Name Can Not Be Empty";
	}

	if( password.length <= 0 ){
		allValid = false;
		document.getElementById('errorPassword').style = "display:block";
		document.getElementById('errorPassword').innerHTML ="Password Can Not Be Empty";
	}

	if( password.toString() != cpassword.toString() )
	{
		allValid = false;
		document.getElementById('errorCpassword').style = "display:block";
		document.getElementById('errorCpassword').innerHTML ="Password Not Match";
	}
	
	return allValid;
}

function resetErrors(){
	document.getElementById('errorName').style 		= "display:none";
	document.getElementById('errorPassword').style 	= "display:none";
	document.getElementById('errorCpassword').style = "display:none";
}