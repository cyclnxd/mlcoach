from sklearn.linear_model import LinearRegression
import numpy as np

class IML():
  __version__ = "0.0.1"

  def __init__(self, node_type: str, hyperparams: dict, data: dict) -> None:
    self.node_type: str = node_type
    self.hyperparams: dict = hyperparams
    self.data: dict = data
    self.numpy_data = {}
    self.model = None
    self.__init_model()
    self.__init_data()

  def run_model(self):
    assert self.model is not None
    self.model.fit(self.numpy_data["X"], self.numpy_data["Y"])
    print(self.model.predict([[3,5]]))
    
  def __init_model(self) -> None:
      match self.node_type:
          case "LinearRegression":
              self.__linear_regression()
          case "LogisticRegression":
              self.__logistic_regression()
          case "DecisionTree":
              self.__decision_tree()
          case "RandomForest":
              self.__random_forest()
          case "SVM":
              self.__svm()
          case "KNN":
              self.__knn()
          case "NaiveBayes":
              self.__naive_bayes()
  def __init_data(self)->None:
    match self.node_type:
      case "LinearRegression":
        self.__linear_regression_data()

  def __linear_regression(self) -> None:
    self.model = LinearRegression(fit_intercept=self.hyperparams["fit_intercept"],
                                  normalize=self.hyperparams["normalize"],
                                  copy_X=self.hyperparams["copy_X"],
                                  n_jobs=self.hyperparams["n_jobs"],
                                  positive=self.hyperparams["positive"])
  def __linear_regression_data(self):
    self.numpy_data["X"] = np.array(self.data["x"])
    self.numpy_data["Y"] = np.array(self.data["y"])

  def __logistic_regression(self) -> None:
    self.model = None

  def __decision_tree(self) -> None:
    self.model = None

  def __random_forest(self) -> None:
    self.model = None

  def __svm(self) -> None:
    self.model = None

  def __knn(self) -> None:
    self.model = None

  def __naive_bayes(self) -> None:
    self.model = None

  def __str__(self) -> str:
    return f"{self.node_type} {self.hyperparams} {self.data}"

