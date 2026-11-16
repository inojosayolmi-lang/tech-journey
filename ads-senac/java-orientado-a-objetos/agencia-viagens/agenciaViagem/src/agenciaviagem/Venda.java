
package agenciaviagem;


public class Venda {
    String nome,formaPagamento,data;
    PacoteViagem pacoteViagem;

    public Venda(String nome, String formaPagamento, String data, PacoteViagem pacoteViagem) {
        this.nome = nome;
        this.formaPagamento = formaPagamento;
        this.data = data;
        this.pacoteViagem = pacoteViagem;
    }

     
   
    
    public double converterValor (double valorDolar, double cotacao){
    return valorDolar * cotacao;
    }
    public void mostrarValor (double margem, double taxas, double cotacao ) {
       double totalDolar = pacoteViagem.calcularTotalPacote(margem, taxas);
       double totalReais = converterValor(totalDolar,cotacao);
        System.out.println("Cliente: " + nome);
        System.out.println("Forma de Pagamento: " + formaPagamento);
        System.out.println("Data da Venda: " + data);
        System.out.println("Total em Dolares: " + totalDolar);
        System.out.println("Total em Reais: " + totalReais);
    }
    
}
