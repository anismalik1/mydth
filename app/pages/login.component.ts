import { Component, OnInit,ViewContainerRef,Renderer2,Inject } from '@angular/core';
import { DOCUMENT} from "@angular/common";
import { Router ,ActivatedRoute} from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms'
import { Meta ,Title} from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { TodoService } from '../todo.service';
import { User } from '../user';
import { AuthService } from '../auth.service';
import {  CordovaService } from '../cordova.service';
import { Authparams } from '../authparams';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as $ from 'jquery';
declare var window : any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
  providers: [TodoService,User,AuthService,CordovaService]
})
export class LoginComponent implements OnInit{
  private token_params : Authparams;
  public phone : number;
  public phone1 : string;
  public password : string;
  public otp : number;
  public step : number = 1; 
  public otp1 : string;
  public otp2: string;
  public otp3: string;
  public otp4 : string;
  private ref : string; 
  logingroup : FormGroup;
  page :string =  "/login";
  notification : string = '';
  remember : any = {rm:false,ph:'',pw : ''};  
constructor( public todoservice : TodoService,
  private _renderer2: Renderer2,
  private cordovaserve : CordovaService, 
   @Inject(DOCUMENT) private _document, 
  private toastr: ToastrManager,
  private authService : AuthService,
  private spinner : NgxSpinnerService,
  private router : Router, 
  vcr: ViewContainerRef,
  private meta : Meta,
  private title : Title,
  private route : ActivatedRoute,
  private fb: FormBuilder
) {  
  if(this.route.snapshot.params['name'])
  {
    this.ref = this.route.snapshot.params['name'];
  }
  if(this.authService.authenticate())
  {
      this.router.navigate(['/']);
  }
  this.logingroup = fb.group({
    'phone' : [null,Validators.compose([Validators.required])],
    'password' : [null,Validators.compose([Validators.required])],
    'remember' : [null],
  });
  this.get_remember();
  if(!this.get_token())
  {
    this.todoservice.set_user_data({name:''});
  }
 }
ngOnInit() {
  this.ini_list()
  if(this.todoservice.get_param('reset') && this.todoservice.get_param('reset') == 'true')
    this.notification = "Your Password Reset Successful. Login here.";
     
  if(this.get_token())
    {
      this.router.navigate(['/']);
    }
    this.fetch_page_data();
}


fetch_page_data()
 {
  let page = {page : this.page}; 
  if(page.page == '')
  {
      return false;
  }
  this.todoservice.fetch_page_data(page)
    .subscribe(
      data => 
      {
        if(data.PAGEDATA)
        {
          this.todoservice.set_page_data(data.PAGEDATA[0]);
          
          $('#page-content').html(this.todoservice.get_page().description);
          this.meta.addTag({ name: 'description', content: this.todoservice.get_page().metaDesc });
          this.meta.addTag({ name: 'keywords', content: this.todoservice.get_page().metaKeyword });
          this.title.setTitle(this.todoservice.get_page().metaTitle);
          window.scroll(0,0);
        }
        this.spinner.hide();  
      }
    ) 
 }

login_submit(login,me)
{
    if(!me)
    {
      me = this; 
    }
    if(document.URL.indexOf('android_asset') !== -1)
    {
      login.device = 'android';
    }
    if(this.step == 2)
    {
      var otp1 = $('#login-page-otps #otp1').val();
      var otp2 = $('#login-page-otps #otp2').val();
      var otp3 = $('#login-page-otps #otp3').val();
      var otp4 = $('#login-page-otps #otp4').val();
      login.otp = otp1.toString()+otp2.toString()+otp3.toString()+otp4.toString();
      login.phone = me.phone;
      login.password = me.password;
      login.step = 2;
    }
    else
    {
      me.phone = login.phone;
      me.password = login.password;
      if(login.remember == false)
      me.authService.clear_remember();
    }
    if(typeof me.phone == "undefined" || typeof me.password == "undefined")
    {
      me.toastr.errorToastr("Please Enter Valid Details", 'Failed');
      return false;
    }
    me.spinner.show();
    me.authService.dologin(login)
    .subscribe(
      data => 
      {
        me.token_params = data;
        if(typeof data.status != 'undefined' && data.status == true)
        {
          let user : any = data.user;
          me.toastr.successToastr('You are logging in...', 'Success!');
          me.authService.AccessToken = me.token_params.accessToken;
          me.authService.storage(data); 
          me.todoservice.set_user_data(user);
          me.user_favourites();
          if(me.ref)
          {
            //me.router.navigate([me.ref],{ queryParams: { month:  this.monthdata[0].total_month});
            me.router.navigate(['/'+me.ref.replace('#', "/").replace('%3D','=').replace('%3F','?')]);
          }
          else
          {
            if(login.device == 'android')
              me.router.navigate(['/mhome']); 
            else
              me.router.navigate(['/']);
          }
         
        }
        else  
        {
          if(typeof data.step != 'undefined' &&  data.step == 'verify')
          {
            me.step = 2;
            me.watch_sms();
          }
          else
          {
            me.toastr.errorToastr(data.message, 'Oops!');
          }
        }
        me.spinner.hide();
      }
    )  
}

watch_sms()
{
    if(window.SMSReceive)
    {
      window.me = this;  
      window.SMSReceive.stopWatch(function() {
          console.log('stopped');
      }, function() {
      });
      window.SMSReceive.startWatch(function() {
        console.log('started');
      }, function() {
      });
      document.addEventListener('onSMSArrive', function(args : any) {
        console.log(args);
        var otp1 = substring(args.data.body,13, 14);
        var otp2 = substring(args.data.body,14, 15);
        var otp3 = substring(args.data.body,15, 16);
        var otp4 = substring(args.data.body,16, 17);
        $('#login-page-otps #otp1').val(otp1);
        $('#login-page-otps #otp2').val(otp2);
        $('#login-page-otps #otp3').val(otp3);
        $('#login-page-otps #otp4').val(otp4);
        window.me.login_submit(window.me.logingroup.value,window.me);
        function substring(string, start, end) {
          var result = '',
              length = Math.min(string.length, end),
              i = start;
        
          while (i < length) result += string[i++];
          return result;
        }  
      });
    }
}

user_favourites()
{
  this.spinner.show();
  this.todoservice.user_favourites({token: this.get_token()})
      .subscribe(
        data => 
        {
          if(!jQuery.isEmptyObject(data))
          {
            this.spinner.hide();
            if(data.status && data.status == 'Invalid Token')
            {
              return false;
            }
            localStorage.setItem('favourite', JSON.stringify(data.favourites));
          }
        }
      )  
}
resend_otp()
{
  
  this.spinner.show();
  let data : any = {phone : this.phone, password : this.password};
  if(document.URL.indexOf('android_asset') !== -1)
  {
    data.device = 'android';
  }
  this.todoservice.resend_otp(data)
    .subscribe(
      data => 
      {
        if(!jQuery.isEmptyObject(data))
        {
          if(data.status == true)
          {
            this.toastr.successToastr(data.message);
            this.watch_sms();
          }
          else
          {
            this.toastr.errorToastr(data.message);
          }
        }
        this.spinner.hide();
      }
    ) 
}
get_remember()
{
  let data : any = this.authService.get_remember();
  data = $.parseJSON(data);
  if(data != null)
  {
    this.remember.rm = true; 
    this.remember.ph = data.ph; 
    this.remember.pw = data.pd; 
  }
}

ini_list()
  {
    if($('#init-list-script'))
    {
      $('#init-list-script').remove();
    }
	  let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `init-list-script`;
    script.text = `
    $('.tabs').tabs();

    $(document).ready(function(){
    $('.dropdown-more-click').click(function(){
      $('.dropdown-more').toggle();
    });
    // $(".dropdown-more").delegate('li','click',function(e){
    //   e.preventDefault();
    //   var targetli = $('#select-item > li:nth-child(9)').html();
    //   $('#select-item > li:nth-child(9)').html(this.innerHTML);
    //   this.innerHTML = targetli;
    //   $('#select-item > li:nth-child(9) a')[0].click();
    //   $('.dropdown-more-click').click()
    // }); 
    });
    `;
    this._renderer2.appendChild(this._document.body, script);
  }

keytab(event){
  if(event.keyCode == 8 || event.keyCode == 46)
  {
    return false;
  }
  let element = event.srcElement.nextElementSibling; // get the sibling element

  if(element == null)  // check if its null
      return;
  else
      element.focus();   // focus if not null
}

get_token()
{
  return this.authService.auth_token();
}
}
