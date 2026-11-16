
package sistemarh;


public abstract class Funcionario {
    private  String nome;
    private String cpf;
    private String endereco;
    private String telefone;
    private String setor;
    
    public abstract double calcularSalario();
    public abstract void aplicarAumento(double percentual);
   
    public void setNome (String nome) {
        this.nome = nome;
    }
    public String getNome () {
        return nome;
    }
    public void setCpf (String cpf) {
        this.cpf = cpf;
    }
    public String getCpf () {
        return cpf;
    }
    public void setEndereco (String endereco) {
        this.endereco = endereco;
    }
    public String getEndereco (){
        return endereco;
    }
    public void setTelefone (String telefone) {
        this.telefone = telefone;
    } 
    public String getTelefone () {
        return telefone;
    }
    public void setSetor (String setor) {
        this.setor = setor;
    }
    public String getSetor () {
        return setor;
    }
    public void mostrarDados () {
        System.out.println("Nome: " + nome);
        System.out.println("CPF: "+ cpf);
        System.out.println("Endereço: " + endereco);
        System.out.println("Telefone: " + telefone);
        System.out.println("Setor: " + setor);
    }
}
