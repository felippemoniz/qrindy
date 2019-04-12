import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CriarPista } from '../criarpista/criarpista';

@Component({
  selector: 'page-home',
  templateUrl: 'criarjogo.html'
})
export class CriarJogo {

  constructor(public navCtrl: NavController) {

  }


adicionarPistas(){
  this.navCtrl.push(CriarPista);
}


}
