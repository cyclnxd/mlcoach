import uvicorn
from fastapi import FastAPI
import numpy as np
import joblib
from pydantic.main import BaseModel

app = FastAPI(title='MLCoach API', description='API for MLCoach', version='1.0')
class Model(BaseModel):
  value: int

@app.get('/')
def index():
  return {"message": 'is ok'}

@app.post('/predict')
def predict(data: Model):
  model = joblib.load('./test_model')
  prediction = model.predict(np.array(data.value).reshape(-1, 1))
  return str(prediction)

if __name__ == '__main__':
  uvicorn.run(app, host='0.0.0.0', port=5000)