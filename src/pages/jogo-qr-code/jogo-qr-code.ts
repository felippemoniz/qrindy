import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams,AlertController,ViewController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { LoadingController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions} from '@ionic-native/barcode-scanner';
//import { NativeAudio } from '@ionic-native/native-audio';
import {Slides} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import { jogo } from '../../model/jogo';


@Component({
  selector: 'page-jogo-qr-code',
  templateUrl: 'jogo-qr-code.html',
})
export class JogoQrCodePage {

  public jogo: jogo;
  public listaPistas;
  public idJogo;
  public nomeJogo;
  public qtPistas;
  public progressoJogo =[];
//  public options : BarcodeScannerOptions;

  private scannedCode=null;
  public jogoFim=false;

  @ViewChild(Slides) slides : Slides;


  constructor(public navCtrl: NavController,
              public dbProvider: DbProvider,
              public viewCtrl: ViewController,
              private barcodeScanner : BarcodeScanner,
              private alertCtrl: AlertController,
              //private nativeAudio: NativeAudio,
              public storage: Storage,
              public loadingCtrl: LoadingController = null,
              public navParams: NavParams) {

              this.jogo = navParams.get('jogo');
              console.log("###########---->" + this.jogo.idJogo)

  //            this.nativeAudio.preloadComplex('sucesso', 'assets/audio/sucesso.mp3', 1, 1, 0);
  //            this.nativeAudio.preloadComplex('fracasso', 'assets/audio/erro2.wav', 1, 1, 0);
  //            this.nativeAudio.preloadComplex('venceu', 'assets/audio/fimJogo.wav', 1, 1, 0);

  }

  ionViewDidLoad() {
    console.log("###########---->" + this.jogo.idJogo)
    this.carregarListaPistas(this.jogo.idJogo)

    //Verifica se tem progresso anterior, se tiver, atualiza as pistas já encontradas
    this.storage.get('progresso_'+this.jogo.idJogo).then((result) => {
      if (result){
        this.progressoJogo = result;
        this.recuperaProgressoJogo();
      }
    });

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



  carregarListaPistas(idJogo){

    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Carregando o jogo...'
    });

    loading.present();

    this.dbProvider.initDB("","28");
    this.dbProvider.executeSql("select *,0 as status from tb_Pista where id_jogo="+ idJogo ).then( obj  => {
    this.listaPistas = obj;

    loading.dismiss();
    this.liberaPrimeiraPista();
    }, () => {
      console.log("Erro")
    });
  }


  achei(id_pista,nu_codigoValidacaoPista){

//    this.options = {formats: "QR_CODE",prompt:"Escaneie o QRCODE da pista", resultDisplayDuration: 0}

//    this.barcodeScanner.scan(this.options).then(barcodeData=> {
//        if (barcodeData.text!=""){
//            if (barcodeData.text == nu_codigoValidacaoPista){
//               this.nativeAudio.play('sucesso');
               this.atualizarPista(id_pista);
               this.atualizarProgresso(id_pista);
               var delay = setInterval(() => {
                 this.proxima();
                 clearInterval(delay);
               },1000);

//            }else{
//              this.nativeAudio.play('fracasso');
//              this.atualizarPistaErrada(id_pista);
//            }
//        }
//    })
  }



  atualizarProgresso(id_pista){
    this.progressoJogo.push(id_pista);
    this.storage.set('progresso_'+this.jogo.idJogo,this.progressoJogo);

  }


  proxima(){
    this.slides.slideNext();
    if (this.slides.isEnd()){
      this.jogoFim = true;
      //this.nativeAudio.play('venceu');
      this.slides.lockSwipes(true);
      this.storage.remove('progresso_'+this.jogo.idJogo);
    }
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


  atualizarPistaErrada(id_pista){
    var lista = this.listaPistas;
    var proximaPista;
    for (let i = 0; i < lista.length; i+=1){
      var pista = lista[i];
      if (pista.id_pista == id_pista){
          pista.status = 3; //pista errada
              //Libera a próxima pista
          break;
      }
    }
    this.listaPistas = lista;
  }



  liberaPrimeiraPista(){
        var lista = this.listaPistas;
        lista[0].status = 1;
        this.listaPistas = lista;
  }




  fechar(){
    let alert = this.alertCtrl.create({
      title: 'Fechar este jogo',
      message: 'Deseja sair do jogo ?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Sim, quero sair.',
          handler: () => {
                this.viewCtrl.dismiss();
          }
        }
      ]
    });
    alert.present();

  }

}
