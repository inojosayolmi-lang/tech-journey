USE KART_2024;

SET SQL_SAFE_UPDATES = 0;

UPDATE Etapas
SET local = 'Salvador'
WHERE local = 'Campo Grande';

UPDATE Etapas
SET local = 'Goiânia'
WHERE local = 'Londrina';

UPDATE Equipe
SET Patrocinio_idPatrocinio = NULL
WHERE Nome = 'Corredores de Aço';

DELETE FROM Patrocinio
WHERE nomePatrocinio = 'Pneus ProDrive';

SELECT * FROM Piloto;
