import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CriarJogo } from '../criarjogo/criarjogo';
import { DetalharJogo } from '../detalharJogo/detalharJogo';
import { DbProvider } from '../../providers/db/db';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public listaJogos;


  constructor(public navCtrl: NavController,
              public dbProvider: DbProvider) {

      this.carregarListaJogos();

  }


  criarJogo(){
    this.navCtrl.push(CriarJogo);
  }


  detalharJogo(idJogo){
    this.navCtrl.push(DetalharJogo,{idJogo: idJogo});
  }


  ionViewDidEnter(){
    this.carregarListaJogos();
  }


  carregarListaJogos(){
    this.dbProvider.initDB("","28");
    this.dbProvider.executeSql("select tbJogo.*, count(tbPista.id_pista)  qtPistas from " +
                              "tb_jogo tbJogo " +
                              "left join  tb_Pista tbPista " +
                              "on tbJogo.id_jogo = tbPista.id_jogo " +
                              "group by tbJogo.id_jogo order by tbJogo.id_jogo desc").then( obj  => {
    this.listaJogos = obj;
    }, () => {
      console.log("Erro")
    });
  }


}
