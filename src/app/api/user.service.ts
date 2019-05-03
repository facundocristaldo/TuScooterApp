import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HTTP) { }


  userLogin(user:String, password:String):HTTPResponse{
    var HTTPResponse : HTTPResponse = {
      status:200,
      headers:{},
      url:"fake",
      data:"OK"
    };
    return HTTPResponse;
  }
}
