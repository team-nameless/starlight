import asyncio
import websockets


async def handle_websocket(conn: websockets.ServerConnection) -> None:
    try:
        while True:
            _message = await conn.recv(decode=True)

            # TODO: Implement protobuf.
            # Need to digest this stuff for a while, and need PM's help for *detailed* specs.
            # https://protobuf.dev/getting-started/pythontutorial/

            # But for now:
            await conn.send(str({"op": "health", "content": "ACK"}), text=True)

    except websockets.ConnectionClosed:
        pass


# Could have restricted to half-duplex, but not for now.
server = websockets.serve(handle_websocket, "0.0.0.0", 5001)
_ = asyncio.get_event_loop().run_until_complete(server)
asyncio.get_event_loop().run_forever()
