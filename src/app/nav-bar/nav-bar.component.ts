import { Component, OnInit, HostListener} from '@angular/core';
import { UserServiceService } from '../ApiServices/user/user-service.service';
import { SearchTourServiceService } from '../ApiServices/searchTour/search-tour-service.service';
import { Router } from '@angular/router';
import { NavbarServiceService } from '../ApiServices/navBar/navbar-service.service';


@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  //show searchSection in the mainSection component
  //according the value of variable below

  

  public toggleSearch(){

    console.log("ok");

    this.searchService.toggleSearch();

  }

  public searchTour(searchData){

    this.searchService.searchTour(searchData);

  }





  public mustAppear = true;

  public mustAppearNavBackground = true;

  //open profile menu ( when user is logged in ) according the value below

  public profileMenuOpened = false;

  public profileMenuOpenedWeb = false;

  //open hamburger menu on mobile version according the boolean value below

  public menuOpened = false;

  //temporary variable ( for testing purpose, will be deleted in the future ) to appear icon when user logged in

  public userIsLogged = false;


  //show search-section and slogan if boolean value of the below variable is true

  public isFrontPage = true;

  public activeNavElementValues = {

    "/home" : "Əsas səhifə - Ziqzaq.az",

    "/localTours" : "Daxili turlar - Ziqzaq.az",

    "/externalTours" : "Xarici turlar - Ziqzaq.az",

    "/transferPage" : "Transfer xidməti - Ziqzaq.az"

  }


  //make navbar element activated according the variable below:

  public activeNavbarElement ="";

  //calculate scrollHeight in order to fire {event} after some scrolling

  public scrollHeight;

  // used for making navbar background white after some scroll

  public navbarBackground = false;


  // open or close the login modal box according the boolean value below:

  public loginModalClosed = true;

  public loginBox(){

    this.loginModalClosed = !this.loginModalClosed;

    this.activateNavElement("login");

  }

  public closeLoginBox(){

    this.loginModalClosed = true;
  }

  // public classOfLoginBoxElements = ["loginContainer" , "signIn" , "loginBoxInput"];

  // public loginBoxClicked(event){

  //   var clickedElement = event.target;

  //   console.log(clickedElement);

  //   this.classOfLoginBoxElements.forEach( data =>{

  //     if( !clickedElement.classList.contains(data) ){

  //       this.loginModalClosed = true;
  //     }

  //   })

  // }



  
  public calculateScrollHeight(){

    this.scrollHeight = Math.floor( document.body.getBoundingClientRect().height - window.innerHeight);

  }

  public activateNavElement(navElement){

    this.activeNavbarElement = navElement;

  }


  //change value of "menuOpened" to true in order to open the hamburger menu on the mobile version

  public openMenu(){

    this.menuOpened = !this.menuOpened;

  }



  public openProfileMenu(){

       this.profileMenuOpened = !this.profileMenuOpened;
  }


  public openProfileMenuWeb(){

    this.profileMenuOpenedWeb = !this.profileMenuOpenedWeb;

  }


  public closeProfileMenuWeb(){
    
    this.profileMenuOpenedWeb = false;
  }


  //API operations start


  public isAuthenticated(){

    //backend terefde token validation api yazilacaq sonra bunu ona uygun duzelt !

    var token = localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : "";

    if(token){

      this.userIsLogged = true;

    }

  }

  public userData = {

    phoneNumber : "",

    email : "",
    
    password : ""

  }

  // the retreived credentials about user, after an user logins successfully (value of output key in json response)

  public userDataAfterLogin;

  public userCredentials = true;

  public login(){

    this.userService.loginUser( this.userData ).subscribe( data =>{

      console.log(data);
      
      this.userDataAfterLogin = data;

      console.log(this.userDataAfterLogin);

      if( !this.userDataAfterLogin.isSuccess ){ // if user credentials server sets isSuccess value to true

        this.userCredentials = false;
  
        return;
  
      }
  
      localStorage.setItem( "userId" , this.userDataAfterLogin.output.id );
  
      localStorage.setItem( "accessToken" , this.userDataAfterLogin.output.accessToken );
  
      localStorage.setItem( "refreshToken" , this.userDataAfterLogin.output.refreshToken );
  
      this.userIsLogged = true;
  
      this.loginBox();

    },

    error => this.userCredentials = false
    
    
    );

  }

  //logOut method

  public logOut(){

    // this.userService.logOut().subscribe( data => console.log(data) ); helelik tam hazir deyil

    localStorage.removeItem("userId");

    localStorage.removeItem("accessToken");

    localStorage.removeItem("refreshToken");

    this.userIsLogged = false;

    this.openProfileMenuWeb();

    this.router.navigate(["home"]);

  }



  //show navbarBackground on specifip pages

  public allowedRoutes = [
    "/home",
    "/localTours",
    "/externalTours"
  ]





  public changeTitle(currentRoute){

    this.navbarService.changeTitle(currentRoute);
  }

  public checkRoute(){

    window.scrollTo(0, 0);

    var currentRoute = window.location.pathname;

    this.activeNavbarElement = this.activeNavElementValues[currentRoute];

    this.changeTitle(currentRoute);

    if( this.allowedRoutes.indexOf(currentRoute) > - 1){
      this.mustAppearNavBackground = true;
    }

    else{
      this.mustAppearNavBackground = false;
    }

  }

  public ifRouteChanged(){

    this.router.events.subscribe( data => {
      this.checkRoute();
    })

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




  //if page scroll height is 5 % of the full scroll height, then make navbar white:

  @HostListener('window:scroll') 
    scrollHandler() {

      var scrollHeight = Math.floor( document.body.getBoundingClientRect().height - window.innerHeight);

      if(  ( window.scrollY / (scrollHeight / 100) ) >= 5 ){ //5 %
       
        this.navbarBackground = true;

      }
      else{

        this.navbarBackground = false;

      }

    }



  constructor( 
    
    public userService : UserServiceService,

    public searchService : SearchTourServiceService,

    public router : Router,

    public navbarService : NavbarServiceService
    
    ) { }

  ngOnInit() {
    
    //default timeout till calculation of scrollHeight:
    //note the timeout can be differ on resource size so, it can be changed

    setTimeout(this.calculateScrollHeight,2000);

    this.isAuthenticated();

    this.ifRouteChanged();

  }



}
