def rmsmallest(x):
    if len(x) == 0:
        return x
    temp = min(x.values())
    ans  = [key for key in x if x[key] == temp]
    x.pop(ans[0])
    return x