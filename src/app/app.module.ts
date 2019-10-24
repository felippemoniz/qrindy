import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BarcodeScanner} from '@ionic-native/barcode-scanner';
import { DbProvider } from '../providers/db/db';
import { AuxiliarProvider } from '../providers/auxiliar/auxiliar';
import { NativeAudio } from '@ionic-native/native-audio';
import {IonicStorageModule} from '@ionic/storage';
import {HttpModule} from '@angular/http';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Onboarding } from '../pages/onboarding/onboarding';
import { CriarJogo } from '../pages/criarjogo/criarjogo';
import { CriarPista } from '../pages/criarpista/criarpista';
import { DetalharJogo } from '../pages/detalharJogo/detalharJogo';
import { ScannerPage } from '../pages/scanner/scanner';
import { JogoQrCodePage  } from '../pages/jogo-qr-code/jogo-qr-code';
import { PreparacaoPage} from '../pages/preparacao/preparacao';
import { Desempenho} from '../pages/desempenho/desempenho';
import { CompartilharService } from '../service/compartilhar-service';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CriarJogo,
    CriarPista,
    ScannerPage,
    DetalharJogo,
    JogoQrCodePage,
    PreparacaoPage,
    Desempenho,
    Onboarding
  ],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CriarJogo,
    CriarPista,
    ScannerPage,
    DetalharJogo,
    JogoQrCodePage,
    PreparacaoPage,
    Desempenho,
    Onboarding
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DbProvider,
    AuxiliarProvider,
    BarcodeScanner,
    NativeAudio,
    CompartilharService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
