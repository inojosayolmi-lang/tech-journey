
package agenciaviagem;


public class PacoteViagem {
    Transporte transporte;
    Hospedagem hospedagem;
    String destino;
    int quantidadeDias;

    public PacoteViagem(Transporte transporte, Hospedagem hospedagem, String destino, int quantidadeDias) {
        this.transporte = transporte;
        this.hospedagem = hospedagem;
        this.destino = destino;
        this.quantidadeDias = quantidadeDias;
    }
        public double totalHospedagem () {
      return hospedagem.valorDiaria * quantidadeDias;
    
}
        public double calcularLucro (double valor, double margem) {
            return valor + (valor * margem / 100);
        }
        public double calcularTotalPacote (double margem, double taxas){
           double valorBase = transporte.valor + totalHospedagem ();
           double valorComLucro =  calcularLucro (valorBase, margem);       
          return valorComLucro + taxas;
        }
}