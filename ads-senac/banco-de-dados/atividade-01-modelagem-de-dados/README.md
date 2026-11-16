# Atividade 1: Modelagem de Banco de Dados

Atividade desenvolvida durante o curso Técnico em Análise e Desenvolvimento de Sistemas do SENAC, utilizando MySQL Workbench para elaborar um Diagrama Entidade-Relacionamento (DER) de um sistema de streaming de filmes.

## Objetivo

Modelar um banco de dados relacional para armazenar informações sobre usuários, endereços, conteúdos, estúdios e visualizações.

## Entidades

- **Usuário:** informações cadastrais dos usuários.
- **Endereço:** dados de localização dos usuários.
- **Conteúdo:** informações sobre filmes e outros conteúdos.
- **Estúdio:** dados dos estúdios de produção.
- **Visualização:** registro dos conteúdos assistidos pelos usuários e do tempo de visualização.

## Relacionamentos

- Usuário e Endereço: relacionamento 1:1.
- Estúdio e Conteúdo: relacionamento 1:N.
- Usuário e Conteúdo: relacionamento N:N, representado pela entidade associativa Visualização.

## Ferramenta utilizada

- MySQL Workbench

## Conhecimentos praticados

- Modelagem conceitual de banco de dados.
- Diagrama Entidade-Relacionamento (DER).
- Entidades, atributos e relacionamentos.
- Cardinalidade.
- Chaves primárias e estrangeiras.