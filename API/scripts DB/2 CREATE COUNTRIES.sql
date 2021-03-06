/*
   jueves, 01 de junio de 201704:34:57 p.m.
   Usuario: 
   Servidor: .
   Base de datos: IAMTrading
   Aplicación: 
*/

/* Para evitar posibles problemas de pérdida de datos, debe revisar este script detalladamente antes de ejecutarlo fuera del contexto del diseñador de base de datos.*/
BEGIN TRANSACTION
SET QUOTED_IDENTIFIER ON
SET ARITHABORT ON
SET NUMERIC_ROUNDABORT OFF
SET CONCAT_NULL_YIELDS_NULL ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
COMMIT
BEGIN TRANSACTION
GO
CREATE TABLE dbo.Countries
	(
	CountryId int NOT NULL IDENTITY (1, 1),
	CountryName nvarchar(200) NOT NULL,
	rowguid nvarchar(40) NOT NULL
	)  ON [PRIMARY]
GO
ALTER TABLE dbo.Countries ADD CONSTRAINT
	DF_Countries_rowguid DEFAULT newid() FOR rowguid
GO
ALTER TABLE dbo.Countries SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
