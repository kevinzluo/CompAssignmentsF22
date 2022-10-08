def rm_smallest(d: dict[int, int]) -> None:
    '''
    Removes the key corresponding to the minimum value and returns changed dictonary.
    '''
    if len(d) == 0:
        return d

    min_key = list(d.keys())[0]
    min_val = d[min_key]
    for k, v in d.items():
        if v < min_val:
            min_val = v
            min_key = k
    
    del d[min_key]
    return d

def test():
    assert 'a' in rm_smallest({'a':1,'b':-10}).keys()
    assert not 'b' in rm_smallest({'a':1,'b':-10}).keys()
    assert not 'a' in rm_smallest({'a':1,'b':5,'c':3}).keys()
    rm_smallest({})
    print("Success!")

if __name__ == "__main__":
    test()
