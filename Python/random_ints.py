import random

def random_ints():
    list = [] # define list
    while True: # it's going to keep looping until we manually break
        rand_num = random.randint(1, 10) # generate random integer 1 to 10 inclusive
        list.append(rand_num) # add to list
        if rand_num == 6: # if the number is 6, we end the loop
            break
    return list


def test():
    N = 10000
    total_length = 0
    for i in range(N):
        l = random_ints()
        assert not 0 in l
        assert not 11 in l
        assert l[-1] == 6
        total_length += len(l)
    assert abs(total_length / N - 10) < 1 # checks that the length of the random strings are reasonable.
    print("Success!")

if __name__ == "__main__":
    test()
