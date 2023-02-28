REM redocly build-docs connectorjs-api.yml -o doc1.html --title "ConnectorJS API" --template template1.html --theme.openapi.nativeScrollbars

SET tarih=2023-02-28

set yamlFile="ConnectorJS-openapi3-%tarih%.yml"

rem p2o "ConnectorJS Client API.postman_collection_%tarih%.json" -f %yamlFile%



fnr.exe --cl --dir .\ --fileMask "*.yml" --find "{{server_uri}}" --replace "https://api.connectorjs.com/connector"
fnr.exe --cl --dir .\ --fileMask "*.yml" --find "version: 1.0.0" --replace "version: v1"


redocly build-docs %yamlFile% -o docs-connectorjs-client-api.html --title "ConnectorJS Client API" --template template1.html --theme.openapi



