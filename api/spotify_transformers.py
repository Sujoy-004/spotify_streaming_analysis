import pandas as pd
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin

class ArtistTargetEncoder(BaseEstimator, TransformerMixin):
    """Custom Transformer to handle Artist Target Encoding within the pipeline."""
    def __init__(self):
        self.mapping = {}
        self.global_mean = 0

    def fit(self, X, y=None):
        # X is expected to be a DataFrame/Array where the first column is 'Artist'
        # y is the target (already log-scaled if coming from TransformedTargetRegressor)
        artist_col = X.iloc[:, 0] if hasattr(X, 'iloc') else X[:, 0]
        temp_df = pd.DataFrame({'Artist': artist_col, 'target': y})
        self.mapping = temp_df.groupby('Artist')['target'].mean().to_dict()
        self.global_mean = np.mean(y) if y is not None else 0
        return self

    def transform(self, X):
        artist_col = X.iloc[:, 0] if hasattr(X, 'iloc') else X[:, 0]
        # Return as 2D array for ColumnTransformer compatibility
        return pd.Series(artist_col).map(self.mapping).fillna(self.global_mean).values.reshape(-1, 1)
