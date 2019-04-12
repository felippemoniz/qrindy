import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CriarJogo } from '../criarjogo/criarjogo';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }


  criarJogo(){
    this.navCtrl.push(CriarJogo);
  }


}
