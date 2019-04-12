import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'criarpista.html'
})
export class CriarPista {


  public tipoPista;

  constructor(public navCtrl: NavController) {

    this.tipoPista = "qrcode";

  }

}
