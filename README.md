<p align="center">
<a href="https://connectorjs.com" _target="blank">
<img src="https://github.com/connectorjs/.github/raw/main/images/connectorjs-logo.png"  width="400" />
</a>
</p>


[![](https://img.shields.io/badge/%F0%9F%8C%90%20Powered_by-miajupiter.com-blueviolet?style=flat&labelColor=%23323232)](https://miajupiter.com) ![GitHub followers](https://img.shields.io/github/followers/miajupiter?label=MiaJupiter&logo=github)


# ConnectorJS

[![](https://img.shields.io/badge/ConnectorJS%20Client%20API-Docs-chocolate?style=flat&logo=openapiinitiative&color=yellow)](https://docs.connectorjs.com/connector)

Remote connector service. Client Connector provides you processing data from your server or computer via Rest service.

## Table of contents
- [Client Connector](#client-connector)
- [Supported Data Systems](#supported-data-systems)
- [Download & Install](#download--install)
- [clientId & clientPass](#clientid--clientpass)
- [Structure](#structure)
- [ConnectorJS Client API](#connectorjs-client-api)
- [License - MIT License](#license---mit-license)

## Client Connector
Download & install this connector to reach to your pc/server over ConnectorJS Restful Services.

## Supported Data Systems
- SQL Server
- MySQL
- PostgreSQL
- Excel
- File System
- Linux Shell
- Windows Command Prompt

## Download & Install
Download [ClientConnector (for Windows)](https://github.com/connectorjs/connector-server) client connector application.
Unpack zip file and run `connectorjs_setup.exe`

Setup needs administration privileges to install properly.

## clientId & clientPass
When the connector runs first time, it takes new id and password from ConnectorJS Server. You need them for authentication.


## Structure

```mermaid
graph LR
cc(api.connectorjs.com/connector/:func/:param1/:param2);style cc fill:#1122dd,color:#eee;
conn(Connector Client);style conn fill:#1122dd,color:#eee;
mdb[(MongoDb)];style mdb fill:#548235,color:#eee;
mssql[(SQL Server)];style mssql fill:#548235,color:#eee;
mysql[(MySQL)];style mysql fill:#548235,color:#eee;
xls[Excel Files];style xls fill:#d4d235,color:#222;
fs[File System];style fs fill:#333333,color:#ddd;
cmd[shell/bash/cmd];style cmd fill:#333333,color:#ddd;
ra{{Rest API}};style ra fill:#4472c4,color:#eee;
socket{{Socket Server}};style socket fill:#4472c4,color:#eee;
internet(Internet);style internet fill:#dd72c4,color:#111;

mdb --- conn
mssql --- conn
mysql --- conn
xls --- conn
fs --- conn
cmd --- conn

conn --- internet
internet --> socket
socket --> ra
ra -->cc

subgraph UI [Local Server or Computer]
mdb
mssql
mysql
xls
fs
cmd
conn
end

subgraph dd [ConnectorJS Server]
socket
cc
ra
end

```

## ConnectorJS Client API

[ConnectorJS Client API Documentation](https://docs.connectorjs.com/connector/)


## License - MIT License

Copyright (c) 2023-**Now** [MiaJupiter Technology Inc.](https://miajupiter.com). All rights reserved. We are proud to be [Open Source](https://opensource.org). For full details about the license, please check the `LICENSE` file in the root directory of the source repository.
