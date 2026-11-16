
package sistemarh;

import java.util.ArrayList;
import java.util.Scanner;
public class SistemaRH {

    public static void main(String[] args) {
       ArrayList<Funcionario> funcionarios = new ArrayList<>();
       Scanner entrada = new  Scanner (System.in);
        for (int i = 0; i < 10; i++) {
            
        
        System.out.println("1- Assalariado");
        System.out.println("2- Horista");
        int tipo = entrada.nextInt();
        entrada.nextLine();
        
        System.out.println("Digite o nome: ");
        String nome = entrada.nextLine();
        System.out.println("Digite o CPF: ");
        String cpf = entrada.nextLine();
        System.out.println("Digite o endereço: ");
        String endereco = entrada.nextLine();
        System.out.println("Digite o telefone: ");
        String telefone = entrada.nextLine();
        System.out.println("Digite o setor: ");
        String setor = entrada.nextLine();
        
        
        if (tipo == 1) {
            Assalariado assalariado = new Assalariado();
            assalariado.setNome(nome);
            assalariado.setCpf(cpf);
            assalariado.setEndereco(endereco);
            assalariado.setTelefone(telefone);
            assalariado.setSetor(setor);
              System.out.print("Digite o salário: ");
          double salario = entrada.nextDouble();
            assalariado.setSalario(salario);
            funcionarios.add(assalariado);
        } else {
            Horista horista = new Horista ();
            horista.setNome(nome);
            horista.setCpf(cpf);
            horista.setEndereco(endereco);
            horista.setTelefone(telefone);
            horista.setSetor(setor);
            System.out.println("Digite as horas trabalhadas: ");
            double horas = entrada.nextDouble();
            horista.setHorasTrabalhadas(horas);
            System.out.println("Digite o valor da Hora: ");
            double valorHora = entrada.nextDouble();
            horista.setValorHora(valorHora);
            
            funcionarios.add(horista);
        }
           entrada.nextLine();
            System.out.println("Deseja cadastrar outro funcionario? S/N? :  ");
            String continuar = entrada.nextLine();
            if (continuar.equalsIgnoreCase("N")) {
            break;
                }
        }
        for (Funcionario funcionario : funcionarios) {
        funcionario.mostrarDados();
        System.out.println("Salário: " + funcionario.calcularSalario());
        System.out.println("--------------------");
    }
        System.out.print("Digite o percentual de aumento: ");
        double percentual = entrada.nextDouble();
        for (Funcionario funcionario : funcionarios) {
            funcionario.aplicarAumento(percentual);
            funcionario.mostrarDados();
            System.out.println("Novo salario: " + funcionario.calcularSalario());
            System.out.println("--------------------");
        }
    }

    }

    
    
