import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class VendorServiceService {


  public currentImgPreview : any = [];

  public apiBase = environment.apiEndpoint;

  public apiUrl = {

    vendorLogin : `${this.apiBase}/vendor/login`,

    getTourServices : `${this.apiBase}/service`,

    getTourProgramType : `${this.apiBase}/programType`,

    vendorAddTour : `${this.apiBase}/tour`,

    sendPrograms : `${this.apiBase}/tourProgram`,

    vendorValidate : `${this.apiBase}/vendor/validate`

  }


  // http headers to inject into the request:

  public sendHeader = {
    
    vendorLogin : {
      headers : new HttpHeaders(  {"Content-Type" : "application/json" } )
    },


    vendorTokenValidate : {
      headers : new HttpHeaders(  {"Content-Type" : "application/json" } )
    },

    getTourService : {
      headers: new HttpHeaders({ 'Access-Control-Allow-Origin' : '*',"Authorization":"Bearer " + localStorage.getItem("vendorToken")})
    },


    getTourPrograms : {
      headers: new HttpHeaders({ 'Access-Control-Allow-Origin' : '*',"Authorization":"Bearer " + localStorage.getItem("vendorToken")})
    },

    
    vendorAddTour : {
      headers: new HttpHeaders({ 'Access-Control-Allow-Origin' : '*',"Authorization":"Bearer " + localStorage.getItem("vendorToken")})
    },

    sendPrograms : {
      headers: new HttpHeaders({ 'Content-Type' : 'application/json' , 'Access-Control-Allow-Origin' : '*',"Authorization":"Bearer " + localStorage.getItem("vendorToken")})
    }

  }



  //recreate headers ( for updating tokens after vendor login )


  public updateHeader(){

    this.sendHeader =  {
    
      vendorLogin : {
        headers : new HttpHeaders(  {"Content-Type" : "application/json" } )
      },

      vendorTokenValidate : {
        headers : new HttpHeaders(  {"Content-Type" : "application/json" } )
      },
  
      getTourService : {
        headers: new HttpHeaders({ 'Access-Control-Allow-Origin' : '*',"Authorization":"Bearer " + localStorage.getItem("vendorToken")})
      },
  
  
      getTourPrograms : {
        headers: new HttpHeaders({ 'Access-Control-Allow-Origin' : '*',"Authorization":"Bearer " + localStorage.getItem("vendorToken")})
      },
  
      
      vendorAddTour : {
        headers: new HttpHeaders({ 'Access-Control-Allow-Origin' : '*',"Authorization":"Bearer " + localStorage.getItem("vendorToken")})
      },
  
      sendPrograms : {
        headers: new HttpHeaders({ 'Content-Type' : 'application/json' , 'Access-Control-Allow-Origin' : '*',"Authorization":"Bearer " + localStorage.getItem("vendorToken")})
      }
  
    }

  }




  public vendorLogin( loginData ){

    return this.http.post( this.apiUrl.vendorLogin , loginData , this.sendHeader["vendorLogin"] );

  }


  //get tourServices to add into the 'vendorTourAddServices' page (page with checkboxes)

  public getTourService(){

    this.updateHeader();

    return this.http.get( this.apiUrl.getTourServices, this.sendHeader["getTourService"] );

  }


  //get programTypes (fealiyyet) to add into the vendorTourAddPrograms page

  public getTourProgramType(){
    this.updateHeader();

    return this.http.get( this.apiUrl.getTourProgramType , this.sendHeader["getTourPrograms"] );
  }



//get values of file input (uploaded imgs in the client side)
//and make an array of them



public convertDateToString(date){

  var year = date.year.toString();

  var day = date.day.toString();

  var month = date.month.toString()
  
  day = day.length == 1 ?  "0" + day : day;

  month = month.length == 1 ?  "0" + month : month;

  var result = year + "-" + month + "-" + day;

  return result;

}





//arrivalTime and departureTime are sent as object
//we need to convert it to a string in order to send it to the server

//services will be array need to be appended seperately

  public addTour( currentImgs , prevTourImgs , tourData) {

    var newTourData = Object.assign({}, tourData);

    var programs = newTourData.Programs;

    console.log(programs);

    var programsLength = programs.length;

    delete newTourData.Programs;

    var objKeys : any;

    var services = newTourData.Services;

    var servicesLength = services.length;

    //delete services from tourdata to append and send it as a array 

    delete newTourData.Services;

    var currentImg : any =  currentImgs.files;

    var currentImgLength = currentImg.length;

    var prevTourImg : any = prevTourImgs.files;

    var prevTourImgLength = prevTourImg.length;


    //converting departureTime and arrivalTime to a string

    var arrivalTime = newTourData.ArrivalTime;

    var departureTime = newTourData.DepartureTime;
    
    newTourData.ArrivalTime = this.convertDateToString(arrivalTime);
    
    newTourData.DepartureTime = this.convertDateToString(departureTime);




    var sendData = new FormData();

    for (let x in newTourData) {


      //images will be sent in the loop below 
      if(x == "currentTourImgs" || x == "prevTourImgs" ){

        continue;

      }

      sendData.append( x, newTourData[x] );

    }


    //for sending images
    for( let x=0; x < currentImgLength; x++){

      sendData.append("Photos", currentImg[x]);

    }


    //for sending images
    for( let x=0; x < prevTourImgLength; x++){

      sendData.append("PreviousPhotos", prevTourImg[x]);

    }

    for( let x = 0; x < servicesLength; x++ ){

      sendData.append("Services" , services[x]);
    }

    for ( let x = 0; x < programsLength; x++ ){

      objKeys = Object.keys(programs[x]);
      
      var objLength = objKeys.length;

      for( let c = 0; c < objLength; c++ ){

        var sendPrograms = "Programs" + "[" + x + "]." + objKeys[c]; 
        console.log(sendPrograms);
        
        sendData.append(sendPrograms , programs[x][objKeys[c]]);

        // console.log(`Programs[${x}].${objKeys[x]}` , programs[c]);
    }

      }


    sendData.append("Image", currentImgs.files[0]);

    

    return this.http.post( this.apiUrl.vendorAddTour, sendData , this.sendHeader["vendorAddTour"] );
  
  }

  // //programs are sent seperately but can be changed in the future

  // public sendPrograms(programs){

  //   return this.http.post( this.apiUrl.sendPrograms , programs , this.sendHeader["sendPrograms"] );

  // }



  public checkLoginStatus(vendorLoginInfo){

    return this.http.post(this.apiUrl.vendorValidate , vendorLoginInfo , this.sendHeader.vendorTokenValidate);
  }


  constructor( public http : HttpClient ) { }
}
