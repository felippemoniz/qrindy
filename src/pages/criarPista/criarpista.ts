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
  private posicaoPista;
  public modoDaTela;  //I-> Inclusão A->Alteração

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

    console.log("ASDFASDFASDFASDFSDFASD")

    //Se vier o id da pista, significa que é uma alteração da pista
    if (this.idPista != null){
      this.modoDaTela = "A";
      this.consultaPista(this.idPista);
      console.log("ISSO E UMA ALTERACAO")
    }else{
      this.modoDaTela = "I";
      this.consultaProximaPista();
      console.log("ISSO E UMA INCLUSAO")
    }


  }


  voltar(){
    this.viewCtrl.dismiss();
  }


  geraCodigo(){

    console.log("DEVERIA TER ENTRADO AQUI#####")

    if (this.modoDaTela == "A"){
      this.codigoNumericoPista = this.auxiliarProvider.geraCodigoAleatorio();
    }

    if (this.codigoNumericoPista == null || this.codigoNumericoPista ==''){
        this.codigoNumericoPista = this.auxiliarProvider.geraCodigoAleatorio();
    }
  }


  consultaProximaPista(){

          this.dbProvider.executeSql("select max(nu_ordem)+1 as proximoValor from tb_Pista where id_jogo=" + this.idJogo ).then( obj  => {
          var proximoValor = obj[0].proximoValor;
          if (proximoValor == null){
             proximoValor = 1;
          }
          console.log("proximo valor->" + proximoValor)
          this.posicaoPista = proximoValor;

        }, function (error) {

        });

  }


  alterarPista(){

    var codigoCadastrado= null;
    var tipoPista;

    //Faz a escolha do tipo de pista (código numérico ou qrcode)
    if (this.tipoPista == 'codigo'){
      codigoCadastrado = this.codigoNumericoPista;
      tipoPista = 1;
    }else{
      codigoCadastrado = this.scannedCode
      tipoPista = 2;
    }

    this.dbProvider.executeSql("update tb_Pista set tp_pista="+tipoPista+", txt_pista='" + this.inputDescricaoPista + "', nu_codigoValidacaoPista='"+ codigoCadastrado + "' where id_jogo="+ this.idJogo+" and id_pista="+this.idPista).then( obj  => {
      this.exibeAlerta("Pista alterada!")
      this.viewCtrl.dismiss();
    }, (erro) => {
        console.log("Erro")
        return null;
    });

  }





  //Cadastra uma pista
  criarPista(){

      var codigoCadastrado= null;
      var tipoPista;

      this.dbProvider.executeSql("select max(nu_ordem)+1 as proximoValor from tb_Pista where id_jogo=" + this.idJogo ).then( obj  => {

              var proximoValor = obj[0].proximoValor;

              //Caso seja a primeira pista, inicializar com 0
              if (proximoValor==null){
                proximoValor = 1;
              }


              //Faz a escolha do tipo de pista (código numérico ou qrcode)
              if (this.tipoPista == 'codigo'){
                codigoCadastrado = this.codigoNumericoPista;
                tipoPista = 1;
              }else{
                codigoCadastrado = this.scannedCode
                tipoPista = 2;
              }

              console.log("#######@>>TP_PISTA:" + tipoPista)

              var parametros = {
                                id_pista: null,
                                id_jogo: this.idJogo,
                                nu_ordem : proximoValor,
                                txt_pista:this.inputDescricaoPista,
                                nu_codigoValidacaoPista: codigoCadastrado,
                                txt_caminhoImagemPista:null,
                                tp_pista:tipoPista};

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
      this.codigoNumericoPista = obj[0].nu_codigoValidacaoPista;
      this.posicaoPista = obj[0].nu_ordem;

      console.log("TIPO DA PISTAooooorererere" + obj[0].nu_ordem)


       if (obj[0].tp_pista=='1'){
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
    //this.scannedCode = "1234"
  }




}
