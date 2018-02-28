USE [IAMTrading]
GO

/****** Object:  View [dbo].[vChargesDescriptions]    Script Date: 01-06-2017 04:10:00 p.m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE VIEW [dbo].[vVendorQuotesDetail]
AS
SELECT  VQD.*
	, I.ItemName
	, I.ItemNameSupplier
FROM dbo.VendorQuotesDetail AS VQD
	INNER JOIN dbo.Items AS I ON VQD.ItemId = I.ItemId
GO
