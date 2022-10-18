import asyncio
import json
from msilib.schema import Class
from time import sleep
from pydantic import Json
import uvicorn
from fastapi import FastAPI, Response
from fastapi import Request
from fastapi import WebSocket
import json
import numpy as np
from ScikitInterface import IML
 
# TODO : predict , score and set_params will be child of IML class

app = FastAPI()


class ParameterParser():
    def __init__(self, request: Request) -> None:
        self.request = request

    async def parse(self) -> dict:
        body = await self.request.body()
        return json.loads(body)

 
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    for a in range(10):
        await websocket.send_text(str(a))
        await asyncio.sleep(1)


if __name__ == '__main__':
    X = np.array([[1, 1], [1, 2], [2, 2], [2, 3]])
    y = np.dot(X, np.array([1, 2])) + 3
    mod = IML("LinearRegression", {"fit_intercept": True, "normalize": False, "copy_X": True, "n_jobs": None, "positive": False}, {"x": X, "y": y})
    mod.run_model()
