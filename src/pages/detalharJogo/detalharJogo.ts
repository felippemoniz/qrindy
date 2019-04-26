import { Component } from '@angular/core';
import { NavController,NavParams,ViewController,ToastController,AlertController,ModalController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { AuxiliarProvider } from '../../providers/auxiliar/auxiliar';
import { PreparacaoPage } from '../preparacao/preparacao';
import {Storage} from '@ionic/storage'
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'detalharJogo.html'
})
export class DetalharJogo {


  public idJogo ;
  public nomeJogo;
  public qtPistas;
  public progressoJogo =[];
  public listaPistas;

  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              public viewCtrl: ViewController,
              public storage: Storage,
              public dbProvider: DbProvider,
              private alertCtrl: AlertController,
              public toastCtrl: ToastController = null,
              public modalCtrl: ModalController=null,
              public loadingCtrl: LoadingController = null,
              public auxiliarProvider: AuxiliarProvider=null) {

              this.idJogo = navParams.get('idJogo');
              this.consultarJogo(this.idJogo);

  }


  ionViewDidLoad() {
    this.consultaProgresso();
  }


  consultaProgresso(){
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Carregando o jogo...'
    });

    loading.present();
    this.carregarListaPistas(this.idJogo)

    this.carregarListaPistas(this.idJogo).then (lista => {
          this.listaPistas = lista;
          //Verifica se tem progresso anterior, se tiver, atualiza as pistas já encontradas
                this.storage.get('progresso_'+this.idJogo).then((result) => {
                  if (result){
                    this.progressoJogo = result;
                    this.recuperaProgressoJogo();
                  }
                });
          }, () => {
             loading.dismiss();
        });

    loading.dismiss();
  }



  recuperaProgressoJogo(){
    var lista = this.listaPistas;
    var progresso = this.progressoJogo;

    for (let i = 0; i < lista.length; i+=1){
      var pista = lista[i];
      if (progresso.indexOf(pista.id_pista)!=-1){
        this.atualizarPista(pista.id_pista)
      }
    }
    this.listaPistas = lista;
  }


  atualizarPista(id_pista){
    var lista = this.listaPistas;
    var proximaPista;
    for (let i = 0; i < lista.length; i+=1){
      var pista = lista[i];
      if (pista.id_pista == id_pista){
          pista.status = 2; //pista resolvida
              //Libera a próxima pista
              if (i<lista.length-1){
                pista = lista[i+1];
                pista.status = 1; //pista liberada
              }
          break;
      }
    }
    this.listaPistas = lista;
  }


  fechar(){
    this.viewCtrl.dismiss();
  }



  consultarJogo(idJogo){

    this.dbProvider.initDB("","28");
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
    this.consultaProgresso();
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


  carregarListaPistas(idJogo){

    return new Promise((resolve, reject) => {
            this.dbProvider.initDB("","28");
            this.dbProvider.executeSql("select *,0 as status from tb_Pista where id_jogo="+ idJogo ).then( obj  => {
            resolve(obj);
          }, (err) => {
            reject(err)
          });

      });
  }


  jogar(idJogo,nomeJogo,qtPistas){
         let jogarModal = this.modalCtrl.create(PreparacaoPage,{idJogo:idJogo,nomeJogo:nomeJogo,qtPistas:qtPistas});
         jogarModal.onDidDismiss(() => {
           this.consultaProgresso();
         });

         jogarModal.present();
  }







  voltar(){
    this.navCtrl.pop();
  }



}
