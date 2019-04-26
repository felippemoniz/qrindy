import { Component } from '@angular/core';
import { NavController, NavParams,ToastController } from 'ionic-angular';
import { ModalController} from 'ionic-angular';
//import { BarcodeScanner} from '@ionic-native/barcode-scanner';


/**
 * Generated class for the ScannerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-scanner',
  templateUrl: 'scanner.html',
})
export class ScannerPage {

  private scannedCode=null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController=null,
              //private barcodeScanner : BarcodeScanner,
              private toastCtrl: ToastController) {



  }

/*
    scanCode(){
      this.barcodeScanner.scan().then(barcodeData=> {
        this.scannedCode = barcodeData.text;
        this.presentToast(barcodeData.text)
      })
    }
*/






    presentToast(text:string) {
      let toast = this.toastCtrl.create({
        message: text,
        duration: 3000,
        position: 'top'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });

      toast.present();
    }



}
