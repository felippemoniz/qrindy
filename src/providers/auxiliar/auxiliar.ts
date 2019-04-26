import { Injectable } from '@angular/core';


@Injectable()
export class AuxiliarProvider {

  constructor() {

  }



    // Retorna apenas o primeiro nome do usuário
    formataPrimeiroNome(nomeCompleto){
      if (nomeCompleto!=null){
        return nomeCompleto.substr(0,nomeCompleto.indexOf(" "));
      }
        return "";
    }


    comparaDataHoje(data){
      var d1 = new Date();
      var d2 = new Date(data.replace('-','/'));
      console.log("d1:" + d1 + " - d2:" + d2)
      if (d1.getTime() > d2.getTime()){
        return true
      }else{
        return false;
      }
    }


    //Valida email
    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }


    //Formato amigável para datas
    formataData(dt){
    if (dt!=null && dt!=""){
          var data = new Date(dt);
          var cont = 0;

          var hora = ("0" + (data.getHours())).slice(-2)
          var minuto = ("0" + (data.getMinutes())).slice(-2)
          var dia = ("0" + (data.getDate())).slice(-2)
          var mes = ("0" + (data.getMonth() + 1)).slice(-2)
          var ano = data.getFullYear();

          if (this.isHoje(dt)){
            return "Hoje às " + hora + ":" + minuto;
          }
          else{
            return dia+"/"+mes+"/"+ ano + " às " + hora + ":" + minuto;
          }
      }
      else{
        return ""
      }
    }


    //função auxiliar para FormataData(dt)
    isHoje(dt){
      var data = new Date(dt);
      var dataAtual = new Date();

      var diaHoje = ("0" + (dataAtual.getDate())).slice(-2)
      var mesHoje = ("0" + (dataAtual.getMonth() + 1)).slice(-2)
      var anoHoje = dataAtual.getFullYear();

      var dia = ("0" + (data.getDate())).slice(-2)
      var mes = ("0" + (data.getMonth() + 1)).slice(-2)
      var ano = data.getFullYear();

      if (diaHoje+mesHoje+anoHoje === dia+mes+ano){
        return true;
      }

      return false

    }


   retiraCaracteresCPF(cpf){
     var retorno = cpf.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
     return retorno;
   }


   geraCodigoAleatorio(){
     return Math.floor(Math.random()*9000) + 1000;
   }

    //valida CPF
    validaCPF(cpfInformado) {
            var cpf = this.retiraCaracteresCPF(cpfInformado)
            if (cpf == null) {
                return false;
            }
            if (cpf.length != 11) {
                return false;
            }
            if ((cpf == '00000000000') || (cpf == '11111111111') || (cpf == '22222222222') || (cpf == '33333333333') || (cpf == '44444444444') || (cpf == '55555555555') || (cpf == '66666666666') || (cpf == '77777777777') || (cpf == '88888888888') || (cpf == '99999999999')) {
                return false;
            }
            let numero: number = 0;
            let caracter: string = '';
            let numeros: string = '0123456789';
            let j: number = 10;
            let somatorio: number = 0;
            let resto: number = 0;
            let digito1: number = 0;
            let digito2: number = 0;
            let cpfAux: string = '';
            cpfAux = cpf.substring(0, 9);
            for (let i: number = 0; i < 9; i++) {
                caracter = cpfAux.charAt(i);
                if (numeros.search(caracter) == -1) {
                    return false;
                }
                numero = Number(caracter);
                somatorio = somatorio + (numero * j);
                j--;
            }
            resto = somatorio % 11;
            digito1 = 11 - resto;
            if (digito1 > 9) {
                digito1 = 0;
            }
            j = 11;
            somatorio = 0;
            cpfAux = cpfAux + digito1;
            for (let i: number = 0; i < 10; i++) {
                caracter = cpfAux.charAt(i);
                numero = Number(caracter);
                somatorio = somatorio + (numero * j);
                j--;
            }
            resto = somatorio % 11;
            digito2 = 11 - resto;
            if (digito2 > 9) {
                digito2 = 0;
            }
            cpfAux = cpfAux + digito2;
            if (cpf != cpfAux) {
                return false;
            }
            else {
                return true;
            }
        }




}
