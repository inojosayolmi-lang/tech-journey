programa
{
	
	funcao inicio()
	{
       cadeia nome, dieta, vegetariano, pagamento
        
		escreva ("Digite o nome do cliente: ")
		leia (nome)

		escreva ("cliente está de dieta? ( sim/nao): " ) 
		leia (dieta) 
		
          escreva ("cliente vegetariano ? ( sim/ nao): " )
          leia (vegetariano)
 
             se ( dieta == "sim"  e  vegetariano == "sim" )
             {
             	 escreva ( "\nCliente : " , nome )
             	 escreva  ( "\nSugestão de Prato: Salada " ) 
             }
             senao se ( dieta == "sim" e vegetariano == "nao" )
             {
               
             	escreva ( nome, "\nSugestão de Prato: Frango Grelhado" )
             }
             
		  senao se ( dieta == "nao" e vegetariano == "sim" )
		    {
		     escreva ( "\nSugestão de Prato : Macarrão ") 
		    }
	    	senao 
	    	   {
	    	   escreva ( "\nCliente : " , nome )
	    	  escreva ( "\nSugestão de Prato : Feijoada " )
	    	   }
	    	  
	    	   
	    	    escreva ("\nQual a forma de pagamento? (dinheiro/ cartão ) :   " )
	    	   leia (pagamento)
	    	   

	    	   se ( pagamento == "dinheiro" )
	    	  {
	    	   escreva ( "\nCliente possui 15% de desconto\n" )
	    	   
	    	  }
	    	 
	}
}
/* $$$ Portugol Studio $$$ 
 * 
 * Esta seção do arquivo guarda informações do Portugol Studio.
 * Você pode apagá-la se estiver utilizando outro editor.
 * 
 * @POSICAO-CURSOR = 913; 
 * @PONTOS-DE-PARADA = ;
 * @SIMBOLOS-INSPECIONADOS = ;
 * @FILTRO-ARVORE-TIPOS-DE-DADO = inteiro, real, logico, cadeia, caracter, vazio;
 * @FILTRO-ARVORE-TIPOS-DE-SIMBOLO = variavel, vetor, matriz, funcao;
 */