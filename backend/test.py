def my_func(arg1, arg2, arg3=None, **kwargs):
    print(f"arg1: {arg1}")
    print(f"arg2: {arg2}")
    print(f"arg3: {arg3}")
    print(f"kwargs: {kwargs}")


my_func("one", arg2="two", password="password")