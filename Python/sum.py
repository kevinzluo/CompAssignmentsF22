
def sum_list(lst, n):
    if sum(lst) == n:
        return True
    return False

def test():
    assert sum_list([-1, 1], 0)
    assert not sum_list([0,2,3], 4)
    assert sum_list([0,2,2], 4)
    print("Success!")

if __name__ == "__main__":
    test()
