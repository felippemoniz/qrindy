import { Component } from '@angular/core';
import { NavController,NavParams,AlertController } from 'ionic-angular';
import { CriarPista } from '../criarpista/criarpista';
import { DbProvider } from '../../providers/db/db';
import { LoadingController } from 'ionic-angular';
import { ModalController} from 'ionic-angular';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'criarjogo.html'
})



export class CriarJogo {

  public nomeJogo;
  public flagNomeInformado=false;
  public idJogo;
  public inputNomeJogo="";
  public listaPistas;
  public inputMensagemTesouro="";
  public modoDaTela;  //I-> Inclusão A->Alteração

  constructor(public navCtrl: NavController,
    private navParams: NavParams,
    public modalCtrl: ModalController=null,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController = null,
    public loadingCtrl: LoadingController = null,
    public dbProvider: DbProvider) {


      this.modoDaTela = navParams.get('modoDaTela');
      //Está no modo de alteração
      if (this.modoDaTela == 'A'){
          this.idJogo = navParams.get('idJogo');
          this.consultarJogo(this.idJogo);
          this.carregarListaPistas(this.idJogo);
          this.flagNomeInformado=true;
      }else{ //Está no modo de inclusão
          this.modoDaTela = 'I';
      }



  }


  alterarJogo(){


    this.dbProvider.executeSql("update tb_Jogo set nm_jogo = '" + this.inputNomeJogo + "', txt_mensagemFinal='" + this.inputMensagemTesouro + "'  where id_jogo="+ this.idJogo).then( obj  => {
      this.exibeAlerta("Jogo Alterado!")
      this.navCtrl.pop();
    }, (erro) => {
        console.log("Erro")
        return null;
    });

  }


  consultarJogo(idJogo){

    this.dbProvider.initDB("","7");
    this.dbProvider.executeSql("select * from " +
                              "tb_jogo  " +
                              "where id_jogo=" + idJogo ).then( obj  => {
    this.inputNomeJogo = obj[0].nm_jogo;
    this.inputMensagemTesouro = obj[0].txt_mensagemFinal;
    console.log(JSON.stringify(obj))

    }, () => {
      console.log("Erro")
    });
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

  if (this.inputNomeJogo !== ""){

    this.criarJogoBD().then (idInserido => {
      this.flagNomeInformado=true;
      this.idJogo = idInserido;
      this.carregarListaPistas(this.idJogo)

    }, () => {

    });

  }else{
    this.exibeAlerta("Ops! Você precisa informar um nome para o seu jogo primeiro!")
  }


  }


  formataExibicao(pista){
    if (pista.length > 120){
    return pista.substring(0,120) + "(...)"
  }else{
    return pista;
  }
  }

  exibeAlerta(msg){
        let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'top',
        cssClass: 'toast',
        showCloseButton: true,
        closeButtonText: 'OK'
      });
      toast.present();
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
                          qt_tempoLimite:null,
                          dt_criacao: new Date(),
                          txt_mensagemFinal: this.inputMensagemTesouro};

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
  console.log(JSON.stringify(obj))
  }, () => {
    console.log("Erro")
  });
}


finalizarPistas(){

  var arrayPistas = this.listaPistas

  if (this.inputMensagemTesouro == ""){
    this.exibeAlerta("Opa! O passo 3 não foi preenchido! Você precisa informar uma mensagem que será apresentada para o jogador ao final do jogo! ")
  }else if (arrayPistas.length == 0){
    this.exibeAlerta("Eita! O passo 2 ficou vazio....Você precisa incluir as pistas do seu jogo! (Senão, tecnicamente não seria um jogo certo?)")
  }else{
    //faz a gravação da mensagem final, se houver
    this.dbProvider.executeSql("update tb_Jogo set txt_mensagemFinal='" + this.inputMensagemTesouro + "'  where id_jogo="+ this.idJogo).then( obj  => {
    this.exibeAlerta("Seu jogo foi criado com sucesso!")
    this.navCtrl.pop();

    }, (erro) => {
        console.log("Erro")
    });
  }

}




}
