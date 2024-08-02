# vsc-activity

## Description
This extension provides a simple way to access current activity in Visual Studio Code using a socket server.

Data is provided by a socket running on port `5000` by default, and can be accessed by connecting to `localhost:5000` using a socket client. The data is sent as a JSON object with the following format:

```json
"editorStatus": {
    "fileName": string,
    "workspace": string
}
``` 

## Usage
To start the server, run the command `Start Activity Server` from the command palette. The server will start running in the background and will provide the current activity data.

To stop the server, run the command `Stop Activity Server` from the command palette.