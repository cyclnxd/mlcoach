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
  model = joblib.load('./test_model')
  print(model)
  prediction = model.predict(np.array(5).reshape(-1, 1))
  print(prediction)
  return str(prediction)




@app.post('/predict')
def predict(data: Model):
  model = joblib.load('./test_model')
  prediction = model.predict(np.array(data.value).reshape(-1, 1))
  return str(prediction)

if __name__ == '__main__':
  uvicorn.run(app, host='127.0.0.1', port=8000)





