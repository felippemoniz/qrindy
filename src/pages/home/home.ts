import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CriarJogo } from '../criarjogo/criarjogo';
import { DetalharJogo } from '../detalharJogo/detalharJogo';
import { DbProvider } from '../../providers/db/db';
import { LoadingController } from 'ionic-angular';
import { Platform } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public listaJogos;
  public qtJogos=0;
    public modal=false;
    public inputCodigo1=""
    public inputCodigo2=""
    public inputCodigo3=""
    public inputCodigo4=""
    public numeroAtivoCodigo;
    public ligaTeclado;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController = null,
              public dbProvider: DbProvider,
              public platform: Platform) {


                platform.ready().then(() => {
                      this.carregarListaJogos();
                });


  }


  ionViewWillEnter(){
      this.carregarListaJogos();
  }


  criarJogo(){
    this.navCtrl.push(CriarJogo)
  }


  detalharJogo(idJogo){
    this.navCtrl.push(DetalharJogo,{idJogo: idJogo});
  }




  carregarListaJogos(){

    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Carregando o jogo...'
    });

    loading.present();

    this.dbProvider.initDB("","7");
    this.dbProvider.executeSql("select tbJogo.*, count(tbPista.id_pista)  qtPistas from " +
                              "tb_jogo tbJogo " +
                              "left join  tb_Pista tbPista " +
                              "on tbJogo.id_jogo = tbPista.id_jogo " +
                              "group by tbJogo.id_jogo order by tbJogo.id_jogo desc").then( obj  => {

    this.listaJogos=obj;
    loading.dismiss();

    if (Array.isArray(obj)) {
      if (obj.length>0){
        this.qtJogos = 1;
      }else{
        this.qtJogos = 0;
      }
    }



    }, () => {
      console.log("Erro")
      loading.dismiss();
    });
  }

  abreModal(){
  this.modal = true;
}

fechaModal(){
  this.inputCodigo1=""
  this.inputCodigo2=""
  this.inputCodigo3=""
  this.inputCodigo4=""
  this.modal = false;
}



  habilitaTeclado(index){

    this.ligaTeclado = true;

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


baixarJogo(){

  var codigo = this.inputCodigo1 + this.inputCodigo2 + this.inputCodigo3 + this.inputCodigo4;


}


validaCodigo(codigo){
/*
var resultado: Observable<any[]>;

  return new Promise((resolve, reject) => {

       console.log("CODIGO:" + codigo)
       resultado = this.afDB.list('jogoExportados', ref => ref.orderByChild('cod_compartilhamento').equalTo(codigo))
        resultado.valueChanges().subscribe( (datas) => {
          console.log(datas)
          if (datas.length > 0 ){
            resolve(datas)
          }else{
            reject(null)
          }
        });
  });
*/
}



  converteData(data){
    let dataPrimitiva = new Date(data)
    let formatted_date =  dataPrimitiva.getDate() + "/" + (dataPrimitiva.getMonth() + 1) + "/" + dataPrimitiva.getFullYear()
    return formatted_date;
  }

}
