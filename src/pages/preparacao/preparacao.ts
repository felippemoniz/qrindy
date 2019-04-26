import { Component } from '@angular/core';
import { NavController, NavParams,ViewController } from 'ionic-angular';
import { jogo } from '../../model/jogo';
import { JogoQrCodePage  } from '../jogo-qr-code/jogo-qr-code';


@Component({
  selector: 'page-preparacao',
  templateUrl: 'preparacao.html',
})



export class PreparacaoPage {

public jogo: jogo;


  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams) {

              this.jogo = new jogo();

              this.jogo.idJogo = navParams.get('idJogo');
              this.jogo.nomeJogo = navParams.get('nomeJogo');
              this.jogo.qtPistas = navParams.get('qtPistas');

              console.log("--> "+ navParams.get('idJogo'))
              console.log("--> "+ navParams.get('nomeJogo'))
              console.log("--> "+ navParams.get('qtPistas'))


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreparacaoPage');
  }

  fechar(){
    this.viewCtrl.dismiss();
  }


  iniciarJogo(){
    this.navCtrl.push(JogoQrCodePage,{jogo:this.jogo})
  }

}
