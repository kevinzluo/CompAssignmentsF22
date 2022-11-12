import numpy as np
def sqrt(x):
    if (type(x) == int or type(x) == float) and x>=0:
        return np.sqrt(x)
    return -1