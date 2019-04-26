import { Component } from '@angular/core';
import { NavController,NavParams,ViewController,AlertController } from 'ionic-angular';
import { ScannerPage } from '../scanner/scanner';
import { DbProvider } from '../../providers/db/db';
import { AuxiliarProvider } from '../../providers/auxiliar/auxiliar';
import { ToastController } from 'ionic-angular';
import { BarcodeScanner} from '@ionic-native/barcode-scanner';


@Component({
  selector: 'page-home',
  templateUrl: 'criarpista.html'
})
export class CriarPista {


  public tipoPista;
  public idJogo;
  public idPista;
  public inputDescricaoPista;
  public codigoNumericoPista;
  private scannedCode=null;

  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private barcodeScanner : BarcodeScanner,
              public viewCtrl: ViewController,
              public dbProvider: DbProvider,
              public toastCtrl: ToastController = null,
              public auxiliarProvider: AuxiliarProvider=null) {

    this.tipoPista = "qrcode";
    this.idJogo = navParams.get('idJogo');
    this.idPista = navParams.get('idPista');

    //Se vier o id da pista, significa que é uma alteração da pista
    if (this.idPista != null){
      this.consultaPista(this.idPista);
    }

  }


  voltar(){
    this.viewCtrl.dismiss();
  }


  geraCodigo(){
    if (this.codigoNumericoPista == null || this.codigoNumericoPista ==''){
        this.codigoNumericoPista = this.auxiliarProvider.geraCodigoAleatorio();
    }
  }


  //Cadastra uma pista
  criarPista(){

      var codigoCadastrado= null;

      this.dbProvider.executeSql("select max(nu_ordem)+1 as proximoValor from tb_Pista where id_jogo=" + this.idJogo ).then( obj  => {
      var proximoValor = obj[0].proximoValor;

      //Caso seja a primeira pista, inicializar com 0
      if (proximoValor==null){
        proximoValor = 1;
      }

      //Faz a escolha do tipo de pista (código numérico ou qrcode)
      if (this.tipoPista == 'codigo'){
        codigoCadastrado = this.codigoNumericoPista;
      }else{
        codigoCadastrado = this.scannedCode
      }

      console.log("TP_PISTA:" + this.tipoPista)

      var parametros = {
                        id_pista: null,
                        id_jogo: this.idJogo,
                        nu_ordem : proximoValor,
                        txt_pista:this.inputDescricaoPista,
                        nu_codigoValidacaoPista: codigoCadastrado,
                        txt_caminhoImagemPista:null,
                        tp_pista:2};

      this.dbProvider.save("tb_Pista",parametros).then( obj  => {
      console.log("DEU CERTO")
      this.fechar();
      }, () => {
          console.log("Erro")
      });


  }, () => {
    console.log("Erro")
    return null;
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



  consultaPista(idPista){
    this.dbProvider.executeSql("select * from tb_Pista where id_jogo="+ this.idJogo+" and id_pista="+ this.idPista ).then( obj  => {
      this.inputDescricaoPista = obj[0].txt_pista;
      this.codigoNumericoPista = obj[0].nu_codigoValidacaoPista

      console.log("CODIGO DA PISTA:" + obj[0].nu_codigoValidacaoPista)

       if (obj[0].tp_pista=='2'){
         this.tipoPista = 'codigo'
       }else{
         this.tipoPista = 'qrcode'
       }

    }, () => {
      console.log("Erro")
      return null;
    });

  }


  excluirPista(idPista) {
    let alert = this.alertCtrl.create({
      title: 'Excluir Pista',
      message: 'Deseja apagar esta pista?',
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
            this.apagarPista(idPista);

          }
        }
      ]
    });
    alert.present();
  }



  apagarPista(idPista){
      console.log("delete from tb_Pista  where id_jogo="+ this.idJogo+" and id_pista="+idPista)
        this.dbProvider.executeSql("delete from tb_Pista  where id_jogo="+ this.idJogo+" and id_pista="+idPista).then( obj  => {
          this.exibeAlerta("Pista Excluida!")
          this.fechar();
        }, (erro) => {
            console.log("Erro")
            return null;
          });
  }



  fechar(){
    this.viewCtrl.dismiss();
  }



  escanearQRCODE(){
    this.barcodeScanner.scan().then(barcodeData=> {
      this.scannedCode = barcodeData.text;
    })
  }




}
