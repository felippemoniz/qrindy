var jogo = (function () {
    function jogo(idJogo,
                nomeJogo,
                qtPistas){

    this.idJogo = idJogo,
    this.nomeJogo = nomeJogo,
    this.qtPistas = qtPistas;
  }
  return jogo;
}());
export {jogo};
