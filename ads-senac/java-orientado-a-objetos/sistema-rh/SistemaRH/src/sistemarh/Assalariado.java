
package sistemarh;


public class Assalariado extends Funcionario{
    private double salario;
    
    @Override
    public double calcularSalario(){
    return salario;
    
}
    public void setSalario (double salario) {
        this.salario = salario;
    }
   public double getSalario() {
       return salario;
    }
   public void aplicarAumento (double percentual) {
       this.salario = salario + (salario * percentual / 100);
   }
}