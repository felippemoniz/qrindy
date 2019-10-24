import { Component } from '@angular/core';
import { NavController, NavParams,ViewController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import {Storage} from '@ionic/storage'
import { LoadingController } from 'ionic-angular';



@Component({
  templateUrl: 'desempenho.html',
})



export class Desempenho {

  public tempoTotal = 200;
  public tempoProgresso= 60;
  public percentual;
  public listaPistas;
  public idJogo;
  public tempoTotalMilisegundos = 0;

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public dbProvider: DbProvider,
              public loadingCtrl: LoadingController = null,
              public navParams: NavParams) {

   this.percentual = ((this.tempoProgresso * 100)/this.tempoTotal) + "%";
   this.idJogo = navParams.get('idJogo');
   this.carregarListaPistas();

  }



  carregarListaPistas(){

      let loading = this.loadingCtrl.create({
        spinner: 'ios',
        content: 'Carregando estatísticas...'
      });

      loading.present();

      this.dbProvider.initDB("","7");
      this.dbProvider.executeSql("select *,0 as tempoTotal, 0 as tempoMilisegundos, 0 as percentual from tb_Pista where id_jogo="+ this.idJogo ).then( obj  => {
        this.listaPistas = obj;
        this.atribuirTemposTotais(this.listaPistas);
        //console.log(JSON.stringify(obj))
        loading.dismiss();

      }, () => {
        console.log("Erro")
        loading.dismiss();
      });
    }


  atribuirTemposTotais(listaPistas){

      var tempoTotal;
      var tempoPistaMilisegundos = 0;
      var percentual;

      for (let i = 0; i < this.listaPistas.length; i++){
          let pista = this.listaPistas[i];
          let tempoInicio = new Date(pista.tempo_inicio_pista);
          let tempoFim = new Date(pista.tempo_fim_pista);

          this.tempoTotalMilisegundos = this.tempoTotalMilisegundos + tempoFim.getTime() - tempoInicio.getTime();
          tempoPistaMilisegundos = tempoFim.getTime() - tempoInicio.getTime();


          tempoTotal = this.diferenca(pista.tempo_inicio_pista, pista.tempo_fim_pista)
          pista.tempoTotal = tempoTotal;
          pista.tempoMilisegundos = tempoPistaMilisegundos;
      }

      for (let i = 0; i < this.listaPistas.length; i++){
          let pista = this.listaPistas[i];
          percentual = ((pista.tempoMilisegundos * 100)/this.tempoTotalMilisegundos) + "%";
          pista.percentual = percentual
      }


  }






  diferenca(data1, data2){

      var date1 = new Date(data1);
      var date2 = new Date(data2);
      var retorno;

      var diff = date2.getTime() - date1.getTime();

      var msec = diff;

      var hh = Math.floor(msec / 1000 / 60 / 60);
      msec -= hh * 1000 * 60 * 60;
      var mm = Math.floor(msec / 1000 / 60);
      msec -= mm * 1000 * 60;
      var ss = Math.floor(msec / 1000);
      msec -= ss * 1000;

      if (hh==0 && mm > 0){
           retorno = mm + " minutos e " + ss + " segundos" ;
      }else if (hh==0 && mm==0){
          retorno = ss + " segundos" ;
      }else {
          retorno = hh + " horas, " + mm + " minutos e " + ss + " segundos" ;
      }

      return retorno;
  }


  converteTempoTotalAmigavel(msec){


    var retorno;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;

    if (hh==0 && mm > 0){
         retorno = mm + " minutos e " + ss + " segundos" ;
    }else if (hh==0 && mm==0){
        retorno = ss + " segundos" ;
    }else {
        retorno = hh + " horas, " + mm + " minutos e " + ss + " segundos " ;
    }

    return retorno;
  }



  fechar(){
    this.viewCtrl.dismiss();
  }


}
