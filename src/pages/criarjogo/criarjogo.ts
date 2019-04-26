import { Component } from '@angular/core';
import { NavController,NavParams,AlertController } from 'ionic-angular';
import { CriarPista } from '../criarpista/criarpista';
import { DbProvider } from '../../providers/db/db';
import { LoadingController } from 'ionic-angular';
import { ModalController} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'criarjogo.html'
})
export class CriarJogo {

  public nomeJogo;
  public flagNomeInformado=false;
  public idJogo;
  public inputNomeJogo;
  public listaPistas;
  public modoEdicao=false;

  constructor(public navCtrl: NavController,
    private navParams: NavParams,
    public modalCtrl: ModalController=null,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController = null,
    public dbProvider: DbProvider) {


  }




  adicionarPistas(){
         let novaPistaModal = this.modalCtrl.create(CriarPista,{idJogo: this.idJogo});
         novaPistaModal.onDidDismiss(() => {
           this.carregarListaPistas(this.idJogo);
         });
         novaPistaModal.present();
  }


  editarPista(idPista){
         let editarPistaModal = this.modalCtrl.create(CriarPista,{idJogo: this.idJogo, idPista: idPista});
         editarPistaModal.onDidDismiss(() => {
           this.carregarListaPistas(this.idJogo);
         });
         editarPistaModal.present();
  }



    voltar(){
      this.navCtrl.pop();
    }


  criarJogo(){

    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Consultando a situação agora...'
    });

    loading.present();

    this.criarJogoBD().then (idInserido => {
      this.flagNomeInformado=true;
      this.idJogo = idInserido;
      this.carregarListaPistas(this.idJogo)
      loading.dismiss();
    }, () => {
       loading.dismiss();
  });

  }



//Cadastra o jogo
criarJogoBD(){
  var parametros;

    return new Promise((resolve, reject) => {

        parametros = {id_jogo: null,
                          nm_jogo: this.inputNomeJogo,
                          nm_premio :"",
                          txt_caminhoImagemPremio:null,
                          txt_senhaAcesso:'1234',
                          qt_tempoLimite:null};

        this.dbProvider.save("tb_jogo",parametros).then( idInserido  => {
          resolve(idInserido);
        }, (err) => {
          reject(err)
        });
});
}



carregarListaPistas(id){

  console.log("select * from tb_Pista where id_jogo=" + id + " order by nu_ordem")
  this.dbProvider.executeSql("select * from tb_Pista where id_jogo=" + id + " order by nu_ordem").then( obj  => {
  this.listaPistas = obj;
  }, () => {
    console.log("Erro")
  });
}



finalizarPistas(){
  this.navCtrl.pop();
}

}
