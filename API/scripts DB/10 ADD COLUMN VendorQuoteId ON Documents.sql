/*
   viernes, 02 de junio de 201704:32:12 p.m.
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
ALTER TABLE dbo.Attachments
	DROP CONSTRAINT FK_Attachments_VendorQuotes
GO
ALTER TABLE dbo.VendorQuotes SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.Attachments ADD CONSTRAINT
	FK_Attachments_VendorQuotes FOREIGN KEY
	(
	VendorQuoteId
	) REFERENCES dbo.VendorQuotes
	(
	VendorQuoteId
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.Attachments
	NOCHECK CONSTRAINT FK_Attachments_VendorQuotes
GO
ALTER TABLE dbo.Attachments SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.Documents ADD
	VendorQuoteId int NULL
GO
ALTER TABLE dbo.Documents ADD CONSTRAINT
	FK_Documents_VendorQuotes FOREIGN KEY
	(
	VendorQuoteId
	) REFERENCES dbo.VendorQuotes
	(
	VendorQuoteId
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.Documents
	NOCHECK CONSTRAINT FK_Documents_VendorQuotes
GO
ALTER TABLE dbo.Documents SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
