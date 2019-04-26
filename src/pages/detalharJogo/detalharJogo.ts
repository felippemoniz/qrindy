import { Component } from '@angular/core';
import { NavController,NavParams,ViewController,ToastController,AlertController,ModalController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { AuxiliarProvider } from '../../providers/auxiliar/auxiliar';
import { PreparacaoPage } from '../preparacao/preparacao';
import {Storage} from '@ionic/storage'

@Component({
  selector: 'page-home',
  templateUrl: 'detalharJogo.html'
})
export class DetalharJogo {


  public idJogo ;
  public nomeJogo;
  public qtPistas;

  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              public viewCtrl: ViewController,
              public storage: Storage,
              public dbProvider: DbProvider,
              private alertCtrl: AlertController,
              public toastCtrl: ToastController = null,
              public modalCtrl: ModalController=null,
              public auxiliarProvider: AuxiliarProvider=null) {

              this.idJogo = navParams.get('idJogo');
              this.consultarJogo(this.idJogo);

  }


  fechar(){
    this.viewCtrl.dismiss();
  }



  consultarJogo(idJogo){

    this.dbProvider.initDB("","20");
    this.dbProvider.executeSql("select tbJogo.*, count(tbPista.id_pista)  qtPistas from " +
                              "tb_jogo tbJogo " +
                              "left join  tb_Pista tbPista " +
                              "on tbJogo.id_jogo = tbPista.id_jogo " +
                              "where tbJogo.id_jogo=" + idJogo +
                              " group by tbJogo.id_jogo").then( obj  => {
    this.nomeJogo = obj[0].nm_jogo;
    this.qtPistas = obj[0].qtPistas;


    }, () => {
      console.log("Erro")
    });
  }



  exibeAlerta(msg){
        let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'top',
        showCloseButton: true,
        closeButtonText: 'OK'
      });
      toast.present();
  }


  excluirJogo(id_jogo) {
    let alert = this.alertCtrl.create({
      title: 'Excluir Jogo',
      message: 'Deseja apagar este jogo??',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Sim ',
          handler: () => {
            this.excluir(id_jogo);

          }
        }
      ]
    });
    alert.present();
  }


  reiniciaJogo(id_jogo){
    let alert = this.alertCtrl.create({
      title: 'Reiniciar Jogo',
      message: 'Deseja reiniciar este jogo? (Todo o progresso será perdido.)',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Sim!',
          handler: () => {
            this.zerarProgresso(id_jogo)

          }
        }
      ]
    });
    alert.present();
  }

  zerarProgresso(id_jogo){
    this.storage.remove('progresso_'+id_jogo);
    this.exibeAlerta("O jogo foi reiniciado com sucesso!")
  }


  excluir(id_jogo){

    this.dbProvider.executeSql("Delete from tb_Pista where id_jogo="+id_jogo).then( obj  => {

        this.dbProvider.executeSql("Delete from tb_jogo where id_jogo="+id_jogo).then( obj  => {
          this.exibeAlerta("O jogo foi apagado com sucesso!")
            this.navCtrl.pop();
        }, () => {
          console.log("Erro")
        });

    }, () => {
      console.log("Erro")
    });

  }



  jogar(idJogo,nomeJogo,qtPistas){
         let jogarModal = this.modalCtrl.create(PreparacaoPage,{idJogo:idJogo,nomeJogo:nomeJogo,qtPistas:qtPistas});
         jogarModal.present();
  }



  voltar(){
    this.navCtrl.pop();
  }



}
