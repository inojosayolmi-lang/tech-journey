CREATE DATABASE KART_2024;

USE KART_2024;

CREATE TABLE Temporada (
    idTemporada INT PRIMARY KEY AUTO_INCREMENT,
    numero INT NOT NULL
);

CREATE TABLE Etapas (
    idEtapa INT PRIMARY KEY AUTO_INCREMENT,
    local VARCHAR(100) NOT NULL,
    data DATE NOT NULL,
    hora TIME NOT NULL,
    Temporada_idTemporada INT NOT NULL,
    FOREIGN KEY (Temporada_idTemporada)
        REFERENCES Temporada(idTemporada)
);

CREATE TABLE Patrocinio (
    idPatrocinio INT PRIMARY KEY AUTO_INCREMENT,
    nomePatrocinio VARCHAR(100) NOT NULL
);

CREATE TABLE Equipe (
    idEquipe INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(100) NOT NULL,
    Patrocinio_idPatrocinio INT,
    FOREIGN KEY (Patrocinio_idPatrocinio)
        REFERENCES Patrocinio(idPatrocinio)
);

CREATE TABLE Piloto (
    idPiloto INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(150) NOT NULL,
    peso DECIMAL(5,2) NOT NULL,
    capitao TINYINT NOT NULL,
    Equipe_idEquipe INT NOT NULL,
    Nacionalidade VARCHAR(45),
    FOREIGN KEY (Equipe_idEquipe)
        REFERENCES Equipe(idEquipe)
);

CREATE TABLE Etapas_has_Piloto (
    Etapa_idEtapa INT NOT NULL,
    Piloto_idPiloto INT NOT NULL,
    PRIMARY KEY (Etapa_idEtapa, Piloto_idPiloto),
    FOREIGN KEY (Etapa_idEtapa)
        REFERENCES Etapas(idEtapa),
    FOREIGN KEY (Piloto_idPiloto)
        REFERENCES Piloto(idPiloto)
);
USE KART_2024;

SHOW TABLES;