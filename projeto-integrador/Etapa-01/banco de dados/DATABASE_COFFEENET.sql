-- ===========================================
-- CRIAÇÃO DO BANCO DE DADOS
-- ===========================================

DROP DATABASE IF EXISTS COFFEENET;
CREATE DATABASE COFFEENET;
USE COFFEENET;

-- ===========================================
-- CRIAÇÃO DAS TABELAS
-- ===========================================

CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(50) UNIQUE,
    senha VARCHAR(45),
    tipo_usuario VARCHAR(45)
);

CREATE TABLE Categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE Produto (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2),
    estoque INT NOT NULL,
    id_categoria INT,
    FOREIGN KEY (id_categoria)
        REFERENCES Categoria(id_categoria)
);

CREATE TABLE Cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(50)
);

CREATE TABLE Venda (
    id_venda INT AUTO_INCREMENT PRIMARY KEY,
    data_venda DATE,
    forma_pagamento VARCHAR(20),
    valor_total DECIMAL(10,2),
    id_usuario INT,
    id_cliente INT,

    FOREIGN KEY (id_usuario)
        REFERENCES Usuario(id_usuario),

    FOREIGN KEY (id_cliente)
        REFERENCES Cliente(id_cliente)
);

CREATE TABLE ItemVenda (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2),
    id_venda INT,
    id_produto INT,

    FOREIGN KEY (id_venda)
        REFERENCES Venda(id_venda),

    FOREIGN KEY (id_produto)
        REFERENCES Produto(id_produto)
);

-- ===========================================
-- INSERÇÃO DE DADOS
-- ===========================================

INSERT INTO Usuario (nome,email,senha,tipo_usuario)
VALUES
('Maria','mariacoffeenet@gmail.com','senh4123@','Administrador'),
('Charles','charlescoffeenet@gmail.com','senh4123@','Gerente'),
('Carlos','carloscoffeenet@gmail.com','senh4123@','Caixa'),
('Andressa','andressacoffeenet@gmail.com','senh4123@','Atendente'),
('Luana','luanacoffeenet@gmail.com','senh4123@','Caixa');

INSERT INTO Categoria (nome)
VALUES
('Bebidas Quentes'),
('Bebidas Geladas'),
('Salgados'),
('Sobremesas');

INSERT INTO Produto (nome,preco,estoque,id_categoria)
VALUES
('Espresso Simples',7.00,30,1),
('Affogato',10.00,15,2),
('Pão de Queijo',8.00,8,3),
('Petit Gateau',12.50,5,4),
('Espresso Duplo',10.00,30,1),
('Frapuccino',12.00,10,2),
('Coxinha de Frango',10.00,6,3),
('Brigadeiro',5.00,20,4),
('Capuccino',12.00,30,1),
('Iced Latte',12.50,10,2),
('Empada de Frango',7.00,12,3),
('Bolo de Laranja',12.50,4,4),
('Carioca Simples',7.50,15,1),
('Capuccino Gelado',13.00,20,2),
('Misto Quente',15.00,3,3),
('Brownie',15.00,8,4),
('Carioca Duplo',10.00,30,1),
('Mocca Gelado',12.50,20,2),
('Empada de Carne',7.00,12,3),
('Mini Cookies (5 unidades)',10.00,4,4),
('Café com Leite',12.00,30,1),
('Soda Italiana',15.00,10,2),
('Coxinha de Carne',10.00,4,3),
('Torta de Limão',13.00,6,4),
('Chás',10.00,20,1),
('Chá Matte Leão',8.00,10,2),
('Risole',7.00,8,3),
('Donuts',10.00,2,4);

INSERT INTO Cliente (nome,email)
VALUES
('Eduardo','eduardo1@gmail.com'),
('Camila','camila@gmail.com'),
('Miguel','miguel@gmail.com'),
('Carolina','carol12@gmail.com'),
('Cristian','cris123@gmail.com'),
('Alice','alice123@gmail.com'),
('Ana','anacarolina@gmail.com'),
('Bruno','bruno@gmail.com');

INSERT INTO Venda (data_venda,forma_pagamento,valor_total,id_usuario,id_cliente)
VALUES
('2026-07-23','Pix',16.00,2,1),
('2026-07-23','Dinheiro',35.00,3,2),
('2026-07-23','Cartão',22.00,3,3),
('2026-07-21','Dinheiro',38.00,5,4),
('2026-07-21','Cartão',51.00,5,5),
('2026-07-20','Pix',70.00,3,6),
('2026-07-20','Dinheiro',86.00,3,7);

INSERT INTO ItemVenda (quantidade,preco_unitario,id_venda,id_produto)
VALUES
(2,8.00,1,3),
(2,12.50,2,10),
(1,10.00,2,2),
(1,12.00,3,9),
(2,5.00,3,8),
(2,15.00,4,16),
(1,8.00,4,3),
(3,13.00,5,14),
(1,12.00,5,21),
(2,15.00,6,15),
(2,15.00,6,16),
(1,10.00,6,2),
(2,15.00,7,16),
(2,15.00,7,22),
(2,13.00,7,24);

-- ===========================================
-- CONSULTAS
-- ===========================================

SELECT * FROM Usuario;
SELECT * FROM Categoria;
SELECT * FROM Produto;
SELECT * FROM Cliente;
SELECT * FROM Venda;
SELECT * FROM ItemVenda;

-- ===========================================
-- CONSULTAS COM WHERE
-- ===========================================

SELECT * FROM Produto
WHERE preco > 10;

SELECT * FROM Cliente
WHERE nome = 'Eduardo';

SELECT * FROM Venda
WHERE forma_pagamento = 'Pix';

-- ===========================================
-- UPDATE
-- ===========================================

UPDATE Usuario
SET tipo_usuario = 'Administrador'
WHERE id_usuario = 2;

UPDATE Categoria
SET nome = 'Cafés Especiais'
WHERE id_categoria = 1;

UPDATE Produto
SET preco = 9.50,
    estoque = 35
WHERE id_produto = 1;

UPDATE Cliente
SET email = 'eduardo.novo@email.com'
WHERE id_cliente = 1;

UPDATE Venda
SET valor_total = 20.00,
    forma_pagamento = 'Cartão'
WHERE id_venda = 1;

UPDATE ItemVenda
SET quantidade = 3
WHERE id_item = 1;

-- ===========================================
-- DELETE
-- ===========================================

-- Remove um item de venda
DELETE FROM ItemVenda
WHERE id_item = 15;

-- Remove um produto que não participa de nenhuma venda
DELETE FROM Produto
WHERE id_produto = 28;

-- Remove um usuário sem relacionamento com vendas
DELETE FROM Usuario
WHERE id_usuario = 4;