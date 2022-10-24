import math

def square_root(n):
    # Your code here!
    if type(n) != int and type(n) != float:
        return -1
    if n < 0:
        return -1
    return math.sqrt(n)

def test():
    assert square_root(4) == 2
    assert square_root(0) == 0
    assert square_root("hello") == -1
    assert square_root(-10) == -1
    print("Success!")

if __name__ == "__main__":
    test()
