import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { HomePage } from '../home/home';


@Component({
  templateUrl: 'onboarding.html'
})


export class Onboarding {

  @ViewChild(Slides) slides: Slides;
  flagUltimoSlide:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


  proximaTela(){
    this.slides.slideNext();
  }

  fechar(){
    this.navCtrl.setRoot(HomePage);
  }

  mudouSlide() {
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex>4){
      this.flagUltimoSlide=true;
    }else{
      this.flagUltimoSlide=false;
    }
  }


}
