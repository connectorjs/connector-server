fnr.exe --cl --dir .\ --fileMask "*.html" --find "<div id=\"redoc\">" --replace "<style>a[href='https://redocly.com/redoc/'] { display:none!important; }</style><div id=\"redoc\" class=\"miajupiter\">"

xcopy "docs-connectorjs-client-api.html" "..\index.html" /y/d
