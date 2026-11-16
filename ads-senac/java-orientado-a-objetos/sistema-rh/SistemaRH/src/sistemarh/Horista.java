
package sistemarh;


public class Horista extends Funcionario {
    private double horasTrabalhadas;
    private double valorHora;
    
    @Override 
    public double calcularSalario (){
    return horasTrabalhadas * valorHora;
}
    public void setHorasTrabalhadas (double horasTrabalhadas) {
        this.horasTrabalhadas = horasTrabalhadas; 
    }
    public void setValorHora (double valorHora) {
       this.valorHora = valorHora;
    
    }
    public double getHorasTrabalhadas () {
        return horasTrabalhadas;
        
    }
    public double getValorHora (){
        return valorHora;
    }
    public void aplicarAumento (double percentual) {
        this.valorHora = valorHora + (valorHora * percentual / 100);
    }
}