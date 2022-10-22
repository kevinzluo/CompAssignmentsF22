def sum(lst, n):
    sum = 0
    for entry in lst:
        sum = sum + entry
    if sum == n:
        return True
    return False

def test():
    assert sum([-1, 1], 0)
    assert not sum([0,2,3], 4)
    assert sum([0,2,2], 4)
    print("Success!")

if __name__ == "__main__":
    test()
