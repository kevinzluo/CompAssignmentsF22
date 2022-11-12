import random

def randomints():
    ans = []
    while True:
        x = random.randrange(1,10)
        ans.append(x)
        if x == 6:
            return ans