del c:\inetpub\wwwroot\iam\app\app.js /F /Q
del c:\inetpub\wwwroot\iam\app\index.html /F /Q
del c:\inetpub\wwwroot\iam\app\app\*.* /S /F /Q
del c:\inetpub\wwwroot\iam\app\js\*.* /S /F /Q
del c:\inetpub\wwwroot\iam\app\css\*.* /S /F /Q
del c:\inetpub\wwwroot\iam\app\images\*.* /S /F /Q
del c:\inetpub\wwwroot\iam\app\ux\*.* /S /F /Q

XCOPY *.* "C:\inetpub\wwwroot\iam\app\*.*" /D /Y /S /EXCLUDE:exclude.TXT
