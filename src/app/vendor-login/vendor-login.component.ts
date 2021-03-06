import { Component, OnInit } from '@angular/core';
import { VendorServiceService } from "../ApiServices/vendor/vendor-service.service";
import { Router } from "@angular/router";
import { HttpClient , HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'vendor-login',
  templateUrl: './vendor-login.component.html',
  styleUrls: ['./vendor-login.component.css']
})
export class VendorLoginComponent implements OnInit {

  public options = {

    headers : new HttpHeaders( { "Content-Type" : "application/json" } )

  }

  public loginData = {

    phoneNumber : "",

    password : ""

  }

  public vendorLogin(){

    this.VendorService.vendorLogin( this.loginData ).subscribe( data => {
      
      var retreivedData = data["output"];

      // document.cookie = `vendorToken=${retreivedData['accessToken']};max-age=315360000‬`; // max-age = 10 years

      localStorage.removeItem("vendorToken");
      
      localStorage.setItem("vendorToken" , retreivedData['accessToken']);

      this.updateToken();

      this.router.navigate(["vendorDashboard"]);


    } );

  }

  //update headers to get updated tokens (for updating tokens after login )

  public updateToken(){

    this.VendorService.updateHeader();

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


    console.log(this.loginData.phoneNumber)


    
  }

  constructor( 

    public VendorService : VendorServiceService,
    public router : Router

     ) { }

  ngOnInit() {

  }

}
