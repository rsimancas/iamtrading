/*
   jueves, 01 de junio de 201704:50:18 p.m.
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
ALTER TABLE dbo.Vendors ADD
	CountryId int NULL
GO
ALTER TABLE dbo.Vendors SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
