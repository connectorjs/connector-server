fnr.exe --cl --dir .\ --fileMask "*.yml" --find "example: '{{" --replace "value: '{{"

redocly build-docs "ConnectorJS Client API-openapi3.yml" -o docs-connectorjs-client-api.html --title "ConnectorJS Client API" --template template1.html --theme.openapi.nativeScrollbars
