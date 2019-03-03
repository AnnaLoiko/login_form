var body 			= document.body;
var tagWrap 		= document.querySelector('.wrap');
var btnSignIn 		= document.getElementById('sign_in');
var btnSignUp 		= document.getElementById('sign_up');
var tagModalWrap;
var boxFormSign 	= '\
						<div class="flex-container">\
							<div class="flex-item-50 btn-div" data-toogle="to-new">Sign in</div>\
							<div class="flex-item-50 btn-div" data-toogle="to-sign">New account</div>\
						</div>\
						<form class="form">\
							<div class="form-content"></div>\
							<button type="submit" class="form-bttn"></button>\
						</form>';
var InpEmail 		=  '<input type="text" id="email" class="inp-txt" placeholder="E-mail">';
var InpUserName 	=  '<input type="text" id="userName" class="inp-txt" placeholder="Username" min="3">';
var boxInpPass 		=  '<div class="box-pwd">\
							<input type="text" id="pwd" class="inp-txt" placeholder="Password">\
							<button type="button" class="add-btn" id="eye">Hide</button>\
						</div>';

var rememberCheck	=  '<input type="checkbox" class="checkbox" id="rememberForm" checked>\
						<label for="rememberForm">Remember me</label>';
var urlTerms;
var agreeCheck		=  '<input type="checkbox" class="checkbox" id="rememberForm" checked>\
						<label for="rememberForm">I agree to the <a href=" ' + urlTerms +  ' " target="_blank">Terms</a></label>';
var textForgotPass 	=  '<p>Lost your passwor? Please enter your amail address. You will receive a link to create a new password.</p>'

btnSignIn.addEventListener('click', function(){ modalForms(renderSignIn)} );
btnSignUp.addEventListener('click', function(){ modalForms(renderSignUp)} );

function modalForms(callForm) {
	callForm();
	toogleForms();	
	removeModal();
	form = document.querySelector('.form');
	form.addEventListener('submit', function(event){
		event.preventDefault();
		var formId = form.getAttribute('id');
		if (document.querySelector('.error-message') !== null) {document.querySelector('.error-message').remove()};
		if (formId == 'login') { validateLogin();}
		if (formId == 'createAccount') { validateCreateAcc();}
		if (formId == 'resetPass') { validateResetPass();}		
	});
}
function validateLogin(){		
	var email 	= validateEmail();
	var pass 	= validatePass();
	if ( email && pass ){
		var user = {userEmail:email, userPass:pass};
		// далее ajax, проверка, есть ли в базе пользователь с таким email и паролем. И если есть - отрисовка контента
		document.body.innerHTML = 'вывод контента';
	}			
}
function validateCreateAcc(){	
	var name 	= validateName();		
	var email 	= validateEmail();	
	var pass 	= validatePass();
	
	var check = document.getElementById('rememberForm');
	if (!check.checked) { showError('<p>Чтобы продолжить регистрацию, вам необходимо принять <a href="#">Условия соглашения</a></p>') };

	if (name && email && pass){
		var newUser = {userName:name, userEmail:email, userPass:pass};
		// далее ajax, проверка, нет ли уже  в базе пользователей такого адреса и имени. Если нет, данные в массив пользователей и сообщение -
		renderMsgSuccess('Спасибо за регистрацию. Вам выслано ...  (это сообщение после проверки, нет ли уже  в базе пользователей такого адреса и имени, и если нет, отправки данных)');
	}			
}
function validateResetPass(){		
	var email 	= validateEmail();	
	if (email){
		// далее ajax, проверка, есть ли в базе пользователей такой адрес. Если да -
		renderMsgSuccess('Вам выслано по указанному адресу ... (это сообщение после проверки, есть ли в базе пользователей такой адрес)');
	}			
}

function validatePass() {
	var pass = document.querySelector('[id="pwd"]').value.trim();
	var reg = /^(?=.*?[a-zA-Z])(?=.*?[0-9]).{3,}$/;
	if(  reg.test(pass) == false ) {
		showError('<p>Пароль должен быть не короче 3 символов, содержать в себе хотя бы 1 букву латинского алфавита и хотя бы 1 цифру</p>');
		return false;
	}else {
		return pass;
	}
}
function validateEmail() {
	var email = document.querySelector('[id="email"]').value.trim();
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	if(reg.test(email) == false) {
		showError('<p>Проверьте корректность почтового адреса. И еmail не должен быть короче 3 символов</p>');
		return false;
	} else {
		return email;
	}
}
function validateName() {
	var name = document.querySelector('[id="userName"]').value.trim();
	var reg = /^(?=.*?[0-9a-zA-Z]).{3,}$/;
	var regFirst = /^[a-zA-Z]+$/;
	if(  reg.test(name) == false || regFirst.test(name.charAt(0)) == false ) {
		showError('<p>Имя пользователя может состоять из букв латинского алфавита и цифр, начинаться с буквы, и быть не короче 3 символов</p>');
		return false;
	} else {
		return name;
	}
}
function showError(errorMessage) {
	if (document.querySelector('.error-message') !== null) {
		document.querySelector('.error-message').innerHTML += errorMessage;
	} else{
		var tagMsgError			= renderElem( 'div' , 'error-message', document.querySelector('.form-content'));
		tagMsgError.innerHTML 	= errorMessage;
	}
	return tagMsgError;
}
function renderMsgSuccess(successMessage) {
	document.querySelector('.form-wrap').innerHTML = '';
	var tagMsgSuccess		= renderElem( 'div' , 'success-message', document.querySelector('.form-wrap'));
	tagMsgSuccess.innerHTML = successMessage;
	return tagMsgSuccess;
}

function renderSignIn() {
	if (tagModalWrap !== undefined) {tagModalWrap.remove()};
	var formContent = renderModalWithForm('Login', 'signIn', 'login');
	formContent.innerHTML 	= InpEmail + boxInpPass + rememberCheck;
	document.querySelector('[data-toogle="to-sign"]').classList.add('no-active');	
	
	var forgotPass   		= renderAddLink( 'add-link' , 'Forgot your password',formContent.parentElement);
	forgotPass.addEventListener('click', function(){ modalForms(renderForgotPass)});		
	
	btnHideShowPass();
}

function renderSignUp() {
	if (tagModalWrap !== undefined) {tagModalWrap.remove()};
	var formContent = renderModalWithForm('Create account', 'signUp', 'createAccount');
	formContent.innerHTML 	= InpUserName + InpEmail + boxInpPass + agreeCheck;
	document.querySelector('[data-toogle="to-new"]').classList.add('no-active');	
	btnHideShowPass();
}

function renderForgotPass() {
	tagModalWrap.remove();
	var formContent = renderModalWithForm('Reset passowrd', 'resetPass', 'resetPass');
	formContent.innerHTML 	= textForgotPass + InpEmail;
	document.querySelector('[data-toogle="to-sign"]').classList.add('no-active');
	var backToLog   		= renderAddLink( 'add-link' , 'Back to log in', formContent.parentElement);
	backToLog.addEventListener('click', function(){ modalForms(renderSignIn)});
}

function renderModalWithForm(btnTitle, btnId, formId) {
	var tagModalWrap 			= renderElem( 'div' , 'modal-wrap', body);
	var tagModalContent 		= renderElem( 'div' , 'modal-content', tagModalWrap);
	var tagFormWrap				= renderElem( 'div' , 'form-wrap', tagModalContent);
	tagFormWrap.innerHTML 		= boxFormSign;
	
	btnFormSubmit 				= document.querySelector('.form-bttn');
	btnFormSubmit.setAttribute('id', btnId);
	btnFormSubmit.textContent 	= btnTitle;

	var form 					= document.querySelector('.form');
	form.setAttribute('id', formId);

	var formContent 			= document.querySelector('.form-content');
	return formContent;
}

function toogleForms(){
	var toogleFormToSignIn 		= document.querySelector('[data-toogle="to-new"]');
	var toogleFormToSignUp 		= document.querySelector('[data-toogle="to-sign"]');
	toogleFormToSignIn.addEventListener('click', function(){ modalForms(renderSignIn)});
	toogleFormToSignUp.addEventListener('click', function(){ modalForms(renderSignUp)});
}

function removeModal(){
	tagModalWrap = document.querySelector('.modal-wrap');
	tagModalContent = document.querySelector('.modal-content');
	tagModalWrap.onclick = function (e) {
		if (event.target == this) {	this.remove();}
	}
	window.onkeydown = function(e) {
	    if (e.keyCode == 27) {tagModalWrap.remove();}
	}
}

function renderElem(tag , cls, tagWrap){
	var elem = document.createElement(tag);
	elem.classList.add(cls);
	tagWrap.appendChild(elem);
	return elem;
}

function renderAddLink(cls , inner, tagWrap){
	var tagAddLink = document.createElement('a');
	tagAddLink.innerHTML = inner;
	tagAddLink.classList.add(cls);
	tagAddLink.setAttribute('href', "#");
	tagWrap.appendChild(tagAddLink);
	return tagAddLink;
}

function btnHideShowPass() {
	var btnHideShow = document.getElementById('eye');
	btnHideShow.addEventListener("click", function(e){
		this.textContent = (this.textContent === 'Show') ? 'Hide' : 'Show';
		(pwd.getAttribute("type")=="text") ? pwd.setAttribute("type","password") : pwd.setAttribute("type","text");
	});
}