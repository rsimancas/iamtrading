USE [IAMTrading]
GO

/****** Object:  View [dbo].[vChargesDescriptions]    Script Date: 01-06-2017 04:10:00 p.m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE VIEW [dbo].[vVendorQuotes]
AS
SELECT  VQ.*
	,V.VendorName
	,CR.CurrencyCode
	,CO.CountryName
FROM dbo.VendorQuotes AS VQ 
	INNER JOIN dbo.Vendors AS V ON VQ.VendorId = V.VendorId
	LEFT OUTER JOIN dbo.CurrencyRates AS CR ON VQ.CurrencyId = CR.CurrencyId
	LEFT OUTER JOIN dbo.Countries AS CO ON CO.CountryId = V.CountryId
GO
