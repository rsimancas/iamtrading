/*
   jueves, 01 de junio de 201704:43:06 p.m.
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
ALTER TABLE dbo.Countries
	DROP CONSTRAINT DF_Countries_rowguid
GO
CREATE TABLE dbo.Tmp_Countries
	(
	CountryId int NOT NULL IDENTITY (1, 1),
	CountryName nvarchar(200) NOT NULL,
	CountryISOCode nchar(2) NOT NULL,
	rowguid nvarchar(40) NOT NULL
	)  ON [PRIMARY]
GO
ALTER TABLE dbo.Tmp_Countries SET (LOCK_ESCALATION = TABLE)
GO
ALTER TABLE dbo.Tmp_Countries ADD CONSTRAINT
	DF_Countries_rowguid DEFAULT (newid()) FOR rowguid
GO
SET IDENTITY_INSERT dbo.Tmp_Countries ON
GO
IF EXISTS(SELECT * FROM dbo.Countries)
	 EXEC('INSERT INTO dbo.Tmp_Countries (CountryId, CountryName, rowguid)
		SELECT CountryId, CountryName, rowguid FROM dbo.Countries WITH (HOLDLOCK TABLOCKX)')
GO
SET IDENTITY_INSERT dbo.Tmp_Countries OFF
GO
DROP TABLE dbo.Countries
GO
EXECUTE sp_rename N'dbo.Tmp_Countries', N'Countries', 'OBJECT' 
GO
COMMIT
