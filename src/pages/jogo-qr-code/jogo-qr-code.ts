import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams,AlertController,ViewController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { LoadingController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions} from '@ionic-native/barcode-scanner';
import { NativeAudio } from '@ionic-native/native-audio';
import {Slides} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import { jogo } from '../../model/jogo';
import { Desempenho  } from '../desempenho/desempenho';



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
  public options : BarcodeScannerOptions;

  private scannedCode=null;
  public jogoFim=false;

  public inputCodigo1;
  public inputCodigo2;
  public inputCodigo3;
  public inputCodigo4;
  public ligaTeclado=false;
  public numeroAtivoCodigo;
  public dtInicioPista;
  public informacoesJogo;

  @ViewChild(Slides) slides : Slides;


  constructor(public navCtrl: NavController,
              public dbProvider: DbProvider,
              public viewCtrl: ViewController,
              private barcodeScanner : BarcodeScanner,
              private alertCtrl: AlertController,
              private nativeAudio: NativeAudio,
              public storage: Storage,
              public loadingCtrl: LoadingController = null,
              public navParams: NavParams) {

              this.jogo = navParams.get('jogo');
              console.log("###########---->" + this.jogo.idJogo)

              this.nativeAudio.preloadComplex('sucesso', 'assets/audio/sucesso.mp3', 1, 1, 0);
              this.nativeAudio.preloadComplex('fracasso', 'assets/audio/erro2.wav', 1, 1, 0);
              this.nativeAudio.preloadComplex('venceu', 'assets/audio/fimJogo.wav', 1, 1, 0);
              this.nativeAudio.preloadComplex('click', 'assets/audio/click.wav', 1, 1, 0);

  }


  ionViewDidLoad() {
    console.log("###########---->" + this.jogo.idJogo)

    this.carregarListaPistas(this.jogo.idJogo).then (obj => {

        this.listaPistas = obj;
        this.liberaPrimeiraPista();
        this.dtInicioPista = new Date();

        //Verifica se tem progresso anterior, se tiver, atualiza as pistas já encontradas
        this.storage.get('progresso_'+this.jogo.idJogo).then((result) => {
          if (result){
            this.progressoJogo = result;
            this.recuperaProgressoJogo();
          }
        });

      }, () => {

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

      return new Promise((resolve, reject) => {

                let loading = this.loadingCtrl.create({
                  spinner: 'ios',
                  content: 'Carregando o jogo...'
                });

                loading.present();

                this.dbProvider.initDB("","7");
                this.dbProvider.executeSql("select *,0 as status from tb_Pista where id_jogo="+ idJogo ).then( obj  => {
                this.listaPistas = obj;
                resolve(obj);

                loading.dismiss();

                }, () => {
                  reject()
                  console.log("Erro")
                });

        });
  }


  acheiCodigo(id_pista,nu_codigoValidacaoPista){

  var codigo = this.inputCodigo1 + this.inputCodigo2 + this.inputCodigo3 + this.inputCodigo4;
  var tempoFim = new Date();
  console.log("######CODIGO:" + codigo)

                if (codigo == nu_codigoValidacaoPista){
                   this.nativeAudio.play('sucesso');
                   this.atualizarPista(id_pista);
                   this.atualizarProgresso(id_pista);
                   console.log("#####################################")
                   this.atualizaTempoPista(id_pista,this.dtInicioPista, tempoFim)

                  this.inputCodigo1 = null;
                  this.inputCodigo2 = null;
                  this.inputCodigo3 = null;
                  this.inputCodigo4 = null;
                  this.ligaTeclado = false;

                   var delay = setInterval(() => {
                     this.dtInicioPista = new Date();
                     this.proxima();
                     clearInterval(delay);
                   },1000);

                }else{
                  this.nativeAudio.play('fracasso');
                  this.atualizarPistaErrada(id_pista);
                  this.mostraErro();
               }

  }



  acheiQrcode(id_pista,nu_codigoValidacaoPista){

      var tempoFim;

    this.options = {formats: "QR_CODE",prompt:"Escaneie o QRCODE da pista", resultDisplayDuration: 0, showTorchButton : true}

    this.barcodeScanner.scan(this.options).then(barcodeData=> {
        if (barcodeData.text!=""){
            if (barcodeData.text == nu_codigoValidacaoPista){
               tempoFim = new Date();
               this.nativeAudio.play('sucesso');
               this.atualizarPista(id_pista);
               this.atualizarProgresso(id_pista);
               console.log("#####################################")
               this.atualizaTempoPista(id_pista,this.dtInicioPista, tempoFim)
               var delay = setInterval(() => {
                 this.dtInicioPista = new Date();
                 this.proxima();
                 clearInterval(delay);
               },1000);

            }else{
             this.nativeAudio.play('fracasso');
              this.atualizarPistaErrada(id_pista);
            }
        }
    })
  }



  atualizarProgresso(id_pista){
    this.progressoJogo.push(id_pista);
    this.storage.set('progresso_'+this.jogo.idJogo,this.progressoJogo);

  }


  proxima(){
    this.slides.slideNext();
    if (this.slides.isEnd()){
      this.jogoFim = true;
      this.nativeAudio.play('venceu');
      this.slides.lockSwipes(true);
      //this.storage.remove('progresso_'+this.jogo.idJogo);
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


  moveFocus(nextElement) {
    nextElement.setFocus();
  }


  habilitaTeclado(index){

    this.ligaTeclado = true;
    this.nativeAudio.play('click');

    switch (index) {
        case 1:
            this.numeroAtivoCodigo=1;
            break;
        case 2:
            this.numeroAtivoCodigo=2;
            break;
        case 3:
            this.numeroAtivoCodigo=3;
            break;
        case 4:
           this.numeroAtivoCodigo=4;
           break;
        default:
      }
}

someTeclado(){
  this.ligaTeclado = false;
}

confirmaNumero(numero){


  switch (this.numeroAtivoCodigo) {
      case 1:
          this.inputCodigo1=numero;
          break;
      case 2:
          this.inputCodigo2=numero;
          break;
      case 3:
          this.inputCodigo3=numero;
          break;
      case 4:
         this.inputCodigo4=numero;
         break;
      default:
    }
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


  mostraErro() {
    const alert = this.alertCtrl.create({
      title: 'Ops!',
      subTitle: 'Parece que este código está incorreto!',
      buttons: ['OK']
    });
    alert.present();
  }


  converteData(data){
    let formatted_date = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate() + " " + data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds()
    return formatted_date;
  }



  atualizaTempoPista(idPista,tempoInicio,tempoFim){

    this.dbProvider.executeSql("update tb_Pista set tempo_inicio_pista='"+this.converteData(tempoInicio)+"', tempo_fim_pista='" + this.converteData(tempoFim) + "' where id_jogo="+ this.jogo.idJogo+" and id_pista="+idPista).then( obj  => {
    }, (erro) => {
        console.log("Erro")
        return null;
    });

  }


  abrirDesempenho(){
    this.navCtrl.push(Desempenho,{idJogo:this.jogo.idJogo})

  }




}
