import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


let principalURL = "http://10.66.24.195:3000/"




@Injectable()
export class CompartilharService {


  static get parameters() {
      return [[Http]];
  }


  constructor (private http:Http) {
      this.http = http;
  }


 /*#################### GETS #########################*/

  consultaJogo(codigoCompartilhamento) {
        return this.http.get(principalURL + 'consultajogo/' + codigoCompartilhamento,null).map(res => res.json());
  }


 /*#################### POST #########################*/


  gravaJogo(jogo) {
    console.log("jogo no ionic " + jogo.cod_compartilhamento )
    return this.http.post(principalURL + 'gravaJogo/', jogo, null).map(res => res.json());

  }




  handleError(error) {
      console.error("DENTRO DO HANDLER:" + error);
      return Observable.throw(error.json().error || 'Server error');
  }


}
