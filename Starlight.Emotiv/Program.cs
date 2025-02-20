using Serilog;
using Websocket.Client;

var log = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

var exitEvent = new ManualResetEvent(false);

string ACCESS_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImNvbS5zdXBlcmR1dC5zdGFybGlnaHQiLCJhcHBWZXJzaW9uIjoiMS4wLjAiLCJleHAiOjE3NDAyMjkwMjEsIm5iZiI6MTczOTk2OTgyMSwidXNlcklkIjoiMTdkYzJkZDUtM2E0ZS00NmE1LTk3YTgtMWE1MjM5MGFjMDMxIiwidXNlcm5hbWUiOiJzdXBlcmR1dCIsInZlcnNpb24iOiIyLjAifQ.s2kDmQr8X-da_GaeNysterLwdFpuRvwVz6cX_ykeYE0";

string DEVICE_NAME = "INSIGHT-92F34521";

string CLIENT_ID = "vjMBqB8DFsCLgmhBInToyO4ucsHTOU83NSuphSDT";

string CLIENT_SECRET = "1zqdwEGengT8sYLO74IFh9kAxPoLFrcTN3WPAzN5WX2thDq9oDuIuKXwnObYMiNTveRW3tsBsuQMkouMC7qMuxMBA1Ci33O2QMjrxSObovRh0EcHDToe1a3xvE9OhQBV";

var wsServer = new Uri("wss://localhost:6868");

var epochMsg = @"{""id"":1,""jsonrpc"":""2.0"",""method"":""getCortexInfo""}";
var accessMsg = $"{{\"id\":1,\"jsonrpc\":\"2.0\",\"method\":\"requestAccess\",\"params\":{{\"clientId\":\"{CLIENT_ID }\",\"clientSecret\":\"{CLIENT_SECRET}\"}}}}";
var queryMsg = @"{""id"": 1,""jsonrpc"": ""2.0"",""method"": ""queryHeadsets"",""params"": {""id"": ""INSIGHT-*""}}";
var authzMsg =
    $"{{\"id\":1,\"jsonrpc\":\"2.0\",\"method\":\"authorize\",\"params\":{{\"clientId\":\"{CLIENT_ID }\",\"clientSecret\":\"{CLIENT_SECRET}\",\"debit\": 99}}}}";
var sessionMsg =
    $"{{\"id\":1,\"jsonrpc\":\"2.0\",\"method\":\"createSession\",\"params\":{{\"status\":\"active\",\"headset\":\"{DEVICE_NAME}\",\"cortexToken\":\"{ACCESS_TOKEN}\"}}}}";

using var client = new WebsocketClient(wsServer);

client.ReconnectTimeout = null;
    
client.ReconnectionHappened.Subscribe(info => log.Information($"Reconnection happened, type: {info.Type}"));
client.MessageReceived.Subscribe(msg => log.Information($"Message received: {msg}"));
client.DisconnectionHappened.Subscribe(msg => log.Information($"Disconnected: {msg}"));

await client.StartOrFail();
client.Send(accessMsg);
// client.Send(epochMsg); // flavor request, don't bother.
// client.Send(queryMsg); // flavor request, don't bother.

// TODO: Serialize the response to get the access token.
// Up till then, the code below will be commented, and a hardcoded one will be used.
// For now, just skim the response and replace the variable value.
client.Send(authzMsg);

// TODO: Serialize the response to get the session token.
// Up till then, the code below will be commented, and a hardcoded one will be used.
// For now, just skim the response and replace the variable value.
client.Send(sessionMsg);


exitEvent.WaitOne();