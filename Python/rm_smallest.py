
def rm_smallest( d) -> list:
    # Your code here!
    if len(d.keys()) == 0:
        return {}
    min_val = min(d.values())
    for key, val in d.items():
        if val == min_val:
            del d[key]
            break
    return d

def test():
    assert 'a' in rm_smallest({'a':1,'b':-10}).keys()
    assert not 'b' in rm_smallest({'a':1,'b':-10}).keys()
    assert not 'a' in rm_smallest({'a':1,'b':5,'c':3}).keys()
    rm_smallest({})
    print("Success!")

if __name__ == "__main__":
    test()
