USE KART_2024;

INSERT INTO Temporada (numero)
VALUES
(1);

INSERT INTO Etapas
(local, data, hora, Temporada_idTemporada)
VALUES
('São Paulo', '2024-01-15', '14:00:00', 1),
('Rio de Janeiro', '2024-02-20', '16:00:00', 1),
('Campo Grande', '2024-03-18', '15:00:00', 1),
('Londrina', '2024-04-22', '13:00:00', 1),
('Porto Alegre', '2024-05-10', '10:00:00', 1);

INSERT INTO Patrocinio (nomePatrocinio)
VALUES
('MotorTech Brasil'),
('Velocidade Extrema'),
('Alta Performance'),
('Turbo Racing'),
('Pneus ProDrive');

INSERT INTO Equipe
(Nome, Patrocinio_idPatrocinio)
VALUES
('Escuderia Veloz', 1),
('Rápidos & Furiosos', 2),
('Fênix Racing', 3),
('Equipe Tempestade', 4),
('Corredores de Aço', 5);

INSERT INTO Piloto
(Nome, peso, capitao, Equipe_idEquipe, Nacionalidade)
VALUES
('Lucas Andrade', 70.5, 1, 1, 'Brasil'),
('Renato Figueiredo', 75.0, 0, 1, 'Brasil'),
('Mateus Silva', 68.0, 0, 2, 'Brasil'),
('Bruno Almeida', 78.3, 1, 2, 'Brasil'),
('Carla Pereira', 60.0, 1, 3, 'Portugal'),
('Gabriela Torres', 58.5, 0, 3, 'Brasil'),
('João Costa', 80.5, 0, 4, 'Brasil'),
('Thiago Santos', 72.5, 0, 4, 'Brasil'),
('Mariana Gomes', 62.0, 1, 5, 'Portugal'),
('Beatriz Lopes', 63.2, 1, 5, 'Portugal');

INSERT INTO Etapas_has_Piloto
(Etapa_idEtapa, Piloto_idPiloto)
VALUES
(1,1),
(1,2),
(1,3),
(1,4),
(1,5),
(1,6),
(1,7),
(1,8),
(1,9),
(1,10);
