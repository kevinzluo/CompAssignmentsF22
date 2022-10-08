import math

def square_root(n):
    '''
    Return the square root of n. 
    Return -1 if not NaN. 
    '''
    try: 
        val = int(n)
        if n < 0:
            return -1
        return math.sqrt(n)
    except ValueError:
        return -1

def test():
    assert square_root(4) == 2
    assert square_root(0) == 0
    assert square_root("hello") == -1
    assert square_root(-10) == -1
    print("Success!")

if __name__ == "__main__":
    test()
