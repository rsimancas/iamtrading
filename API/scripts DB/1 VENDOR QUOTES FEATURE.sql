/*
   jueves, 01 de junio de 201703:57:59 p.m.
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
ALTER TABLE dbo.Items SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.Vendors SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.CurrencyRates SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
CREATE TABLE dbo.VendorQuotes
	(
	VendorQuoteId int NOT NULL IDENTITY (1, 1),
	VendorId int NOT NULL,
	VendorQuoteDate datetime NOT NULL,
	VendorQuoteReference nvarchar(20) NOT NULL,
	CurrencyId int NOT NULL,
	VendorQuoteFolio nchar(10) NOT NULL
	)  ON [PRIMARY]
GO
ALTER TABLE dbo.VendorQuotes ADD CONSTRAINT
	PK_VendorQuotes PRIMARY KEY CLUSTERED 
	(
	VendorQuoteId
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
ALTER TABLE dbo.VendorQuotes ADD CONSTRAINT
	FK_VendorQuotes_Vendors FOREIGN KEY
	(
	VendorId
	) REFERENCES dbo.Vendors
	(
	VendorId
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.VendorQuotes ADD CONSTRAINT
	FK_VendorQuotes_CurrencyRates FOREIGN KEY
	(
	CurrencyId
	) REFERENCES dbo.CurrencyRates
	(
	CurrencyId
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.VendorQuotes SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.Attachments ADD
	VendorQuoteId int NULL
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
CREATE TABLE dbo.VendorQuotesDetail
	(
	VQDetailId int NOT NULL IDENTITY (1, 1),
	VendorQuoteId int NOT NULL,
	ItemId int NOT NULL,
	VQDetailCost decimal(18, 6) NOT NULL,
	VQDetailLineNumber int NOT NULL
	)  ON [PRIMARY]
GO
ALTER TABLE dbo.VendorQuotesDetail ADD CONSTRAINT
	DF_VendorQuotesDetail_VQDetailCost DEFAULT 0 FOR VQDetailCost
GO
ALTER TABLE dbo.VendorQuotesDetail ADD CONSTRAINT
	FK_VendorQuotesDetail_VendorQuotes FOREIGN KEY
	(
	VendorQuoteId
	) REFERENCES dbo.VendorQuotes
	(
	VendorQuoteId
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.VendorQuotesDetail ADD CONSTRAINT
	FK_VendorQuotesDetail_Items FOREIGN KEY
	(
	ItemId
	) REFERENCES dbo.Items
	(
	ItemId
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.VendorQuotesDetail SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
