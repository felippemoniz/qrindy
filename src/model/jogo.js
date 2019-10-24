var jogo = (function () {
    function jogo(idJogo,
                nomeJogo,
                qtPistas,
                mensagemTesouro){

    this.idJogo = idJogo,
    this.nomeJogo = nomeJogo,
    this.qtPistas = qtPistas;
    this.mensagemTesouro = mensagemTesouro;
  }
  return jogo;
}());
export {jogo};
