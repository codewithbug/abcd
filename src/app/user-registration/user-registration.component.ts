import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../ApiServices/user/user-service.service';


@Component({
  selector: 'user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {



  public modalOpen = false;


  public showModal(){
    this.modalOpen = true;
    document.body.style.overflow="hidden";

  }
  public closeModal(){
    this.modalOpen = false;
    document.body.style.overflow="visible";
  }

  public userAgreed = false;
  public agreedTerms(b){
    this.userAgreed = true;
    b.checked=true;
  }


  //user resgistration (api test)


  //formValidation

  public formFields = [ "name", "surname", "email", "phoneNumber", "password", "confirmPassword", "birthday" ];
  

  public hasError : any = {

    "name": false,

    "surname": false,

    "email": false,

    "phoneNumber": false,

    "password": false,

    "confirmPassword": false,

    "birthday": false,

    "gender": false

  }



  public validationMessages = {

    "name": "Boş buraxmaq olmaz",

    "surname": "Boş buraxmaq olmaz",

    "email": "Boş buraxmaq olmaz",

    "phoneNumber": "Boş buraxmaq olmaz",

    "password": "Boş buraxmaq olmaz",

    "confirmPassword": "Boş buraxmaq olmaz",

    "birthday": "Boş buraxmaq olmaz",

    "gender": "Boş buraxmaq olmaz"

  }

  public validationLength = {

    name : { min : 3, max : 20 },
    
    surname : { min : 3, max : 20 },

    email : { min : 3, max : 20 },
    
    phoneNumber : { min : 3, max : 20 },

    password : { min : 3, max : 20 },

    confirmPassword : { min :3, max : 20},

    birthday : { min :3, max : 20}


}

  public userData={

    "name": "",

    "surname": "",

    "email": "",

    "phoneNumber": "",

    "password": "",

    "confirmPassword": "",

    "birthday": "",

    "gender": ""

  }

  public validateForm(){

    var hasError = false;

    this.formFields.map( field => {

      if( this.userData[field].length < 1){
        
        this.hasError[field] = true;

        hasError = true;

      }

      if( (this.userData[field].length && this.userData[field].length < this.validationLength[field].min) || (this.userData[field].length && this.userData[field].length < this.validationLength[field].min) ){

                        
        this.validationMessages[field] ="uzunluq 3-20 arası olmalıdır";

        this.hasError[field] = true;
      }

    })

    return hasError;

  }


  public resetValidation(){

    this.hasError  = {

      "name": false,
  
      "surname": false,
  
      "email": false,
  
      "phoneNumber": false,
  
      "password": false,
  
      "confirmPassword": false,
  
      "birthday": false,
  
      "gender": false
  
    }

  }

  public registerErrors = {

    "The record has already been created. You cannot create again." : "İstifadəçi artıq mövcuddur"

  }


  public registerUser (birthday){

    this.resetValidation();


    if( !this.validateForm() ){
      
      this.userData.birthday = birthday;
      
      this.userService.registerUser(this.userData).subscribe( data =>{
        
        var retreivedData :any = data;
        
        if ( retreivedData.isSuccess){
          
          this.codeSent = true;
        
        }
      
      },

      error => {
        var error = error.error.errors[0];

        if( this.registerErrors[error] ){

          this.validationMessages.phoneNumber = this.registerErrors[error];

          this.hasError["phoneNumber"] = true;
        }
      }
      );
    
    }
  }


  public addCountryCode(inputEl){

    // inputEl.value = "994";

    // console.log(this.userData.phoneNumber);

    // return;



    if(inputEl.value.length < 3){
      inputEl.value="994";
    }



    if(inputEl.value.slice(0,3) != "994" ){


      inputEl.value = "994" + inputEl.value.slice(3);

    }


    console.log(this.userData.phoneNumber)


    
  }

  //verify the code sent via sms

  public sendSms(){

    var phoneNumber = {

      phoneNumber : this.userData.phoneNumber

    }


    this.userService.sendSms(phoneNumber).subscribe( data => {
      
      var retreivedData : any = data;

      if( retreivedData.isSuccess ){

        this.codeSent = true;
        //
      }
      
    });

  }

  public verifyData = {

    phoneNumber : "",

    code : 0

  }

  public verifySmsCode(){

    this.verifyData.phoneNumber = this.userData.phoneNumber;

    this.verifyData.code = Number(this.verifyData.code);

    this.userService.verifySmsCode(this.verifyData).subscribe( data => {

      var retreivedData : any = data;


      if( retreivedData.isSuccess ){

        this.registrationSuccessfull = true;

      }

    } );

  }

  public userNumberCheckData : any = {
    "phoneNumber" : ""
  }

  public checkIfNumberExists(){

    this.resetValidation();


    if( !this.validateForm() ){

      //operations when form is valid

      console.log("ok");

      this.userNumberCheckData.phoneNumber = this.userData.phoneNumber;

      this.userService.checkIfNumberExists(this.userNumberCheckData).subscribe( data => {

        var retreivedData : any = data;

        if( retreivedData.isSuccess ){//if number doesn't exists on database

          this.sendSms();
        }

      } );

    }

  }


  //for notification on registration

  public registrationSuccessfull = false;


  //for sms verification


  //a field will be shown to type the code which retreived by sms when this value will be true

  public codeSent = false; 



  // public notifyPanel = false; //notification panel will appear when value is true

  // public notifyMessage = "";

  // public notifyUser(message){

  //   this.notifyMessage = message;

  //   this.notifyPanel = true; //make notification panel visible

  //   this.disableNotifyPanel(); //dissapear notifyPanel after some time

  // }

  // public disableNotifyPanel(){

  //   setTimeout(_=>this.notifyPanel = false , 2000);

  // }



  constructor( public userService : UserServiceService ) { }

  ngOnInit() {
  }


}
