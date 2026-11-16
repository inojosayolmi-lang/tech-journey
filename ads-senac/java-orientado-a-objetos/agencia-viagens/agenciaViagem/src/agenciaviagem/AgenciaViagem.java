
package agenciaviagem;
import java.util.Scanner;
public class AgenciaViagem {

    public static void main(String[] args) {
        Scanner entrada = new Scanner (System.in);
        System.out.println("Digite o tipo de transporte: ");
        String tipoTransporte = entrada.nextLine();
        System.out.println("Digite o valor do Transporte: ");
        double valorTransporte = entrada.nextDouble();
        entrada.nextLine();
        
   Transporte transporte = new Transporte (tipoTransporte,valorTransporte);
        System.out.println("Digite a descricao da Hospedagem: ");
        String descricaoHospedagem = entrada.nextLine();
        System.out.println("Digite o valor da Diaria: ");
        double valorDiaria = entrada.nextDouble();
        entrada.nextLine();
  Hospedagem hospedagem = new Hospedagem (descricaoHospedagem, valorDiaria); 
  
        System.out.println("Digite o Destino:  ");
        String destino = entrada.nextLine();
        System.out.println("Digite a quantidade de dias: ");
        int quantidadeDias = entrada.nextInt();
        entrada.nextLine();
        
    PacoteViagem pacoteViagem = new PacoteViagem (transporte,hospedagem,destino,quantidadeDias);
    
        System.out.println("Digite a margem de Lucro (%) :   ");
        double margem = entrada.nextDouble();
        
        System.out.println("Digite as taxas adicionais: ");
        double taxas = entrada.nextDouble();
        
        double totalPacote = pacoteViagem.calcularTotalPacote(margem, taxas);
        System.out.println("Destino: "+ pacoteViagem.destino);
        System.out.println("Quantidade de dias: " + pacoteViagem.quantidadeDias);
        System.out.println("Transporte: " + pacoteViagem.transporte.tipo);
        System.out.println("Valor do transporte: " + pacoteViagem.transporte.valor);
        System.out.println("Hospedagem: " + pacoteViagem.hospedagem.descricao);
        System.out.println("Valor da diaria: " + pacoteViagem.hospedagem.valorDiaria);
        System.out.println("Total Pacote em Dolares: " + totalPacote);
        entrada.nextLine();
        
        System.out.println("Digite o nome do cliente: ");
        String nome = entrada.nextLine();
        
        System.out.println("Digite a forma de pagamento: ");
        String formaPagamento = entrada.nextLine();
        
        System.out.println("Digite a data da venda: ");
        String data = entrada.nextLine();
        
        Venda venda = new  Venda (nome,formaPagamento,data,pacoteViagem);
        System.out.println("Digite a cotação do dolar: ");
        double cotacao = entrada.nextDouble();
        entrada.nextLine();
        
        venda.mostrarValor(margem, taxas, cotacao);
}
}