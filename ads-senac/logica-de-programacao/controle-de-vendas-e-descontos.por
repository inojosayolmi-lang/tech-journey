programa
{
	funcao inicio()
	{
		
		cadeia nomes[6]
		real valores[6], valor_gasto = 0.0, desconto_dia, total_vendas = 0.0
		inteiro qtde_Desconto = 0

		
		escreva("Qual o desconto do dia ? : ")
		leia(desconto_dia)

		
		para (inteiro i = 0 ; i < 6 ; i++) {
			escreva("\nQual o nome do cliente? : ")
			leia(nomes[i])
			escreva("Quanto ", nomes[i], " gastou na loja? : ")
			leia(valores[i])
		}

		
		escreva("\n--- VENDAS ---\n")
		
		para (inteiro i = 0 ; i < 6 ; i++) {
			
			se ( valores[i] > 100.00 ) {
				
				qtde_Desconto = qtde_Desconto + 1
				valor_gasto = valores[i] - desconto_dia
				escreva("\n-> ", nomes[i], " recebeu desconto")
				escreva("\nValor total (com desconto): ", valor_gasto, "\n")
			}
			senao {
				
				valor_gasto = valores[i]
				escreva("\n", nomes[i], " Não recebeu desconto" )
				escreva("\nValor total: ", valor_gasto, "\n")
			}

			total_vendas = total_vendas + valor_gasto
		} 

		
		escreva("\n--------------------------------")
		escreva("\nValor total recebido pela loja: ", total_vendas)
		escreva("\nQuantos usuários tiveram desconto: ", qtde_Desconto)
		escreva("\n--------------------------------\n")
	}
}
/* $$$ Portugol Studio $$$ 
 * 
 * Esta seção do arquivo guarda informações do Portugol Studio.
 * Você pode apagá-la se estiver utilizando outro editor.
 * 
 * @POSICAO-CURSOR = 420; 
 * @PONTOS-DE-PARADA = ;
 * @SIMBOLOS-INSPECIONADOS = ;
 * @FILTRO-ARVORE-TIPOS-DE-DADO = inteiro, real, logico, cadeia, caracter, vazio;
 * @FILTRO-ARVORE-TIPOS-DE-SIMBOLO = variavel, vetor, matriz, funcao;
 */