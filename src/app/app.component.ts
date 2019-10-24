import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { Onboarding } from '../pages/onboarding/onboarding'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = Onboarding;

  constructor(platform: Platform,
              statusBar: StatusBar,
              storage:Storage,
              splashScreen: SplashScreen) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

/*
      //### PARA ONBOARDING
      this.storage.get('introShown').then((result) => {
       if(result){
           this.rootPage = HomePage;
       } else {
           this.rootPage = Onboarding;
           this.storage.set('introShown', true);
         }
      });
*/


    });
  }
}
