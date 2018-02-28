USE [IAMTrading]
GO

/****** Object:  View [dbo].[vVendorQuotesDetail]    Script Date: 05-06-2017 06:30:01 p.m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



ALTER VIEW [dbo].[vVendorQuotesDetail]
AS
SELECT  VQD.*
	, I.ItemName
	, I.ItemNameSupplier
	, I.ItemGYCode
	, I.ItemNum
	, I.ItemNumSupplier
FROM dbo.VendorQuotesDetail AS VQD
	INNER JOIN dbo.Items AS I ON VQD.ItemId = I.ItemId

GO


