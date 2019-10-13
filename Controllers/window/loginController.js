const form = document.querySelector('#loginForm');

if(form) {
	form.addEventListener('submit',submitForm);

	function submitForm(e) {
		e.preventDefault();
		let password = document.querySelector("#password").value;
		ipc.send("Attemp:Login",password);
	}
}

