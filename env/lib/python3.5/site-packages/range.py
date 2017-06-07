def range_help(the_list,level):
    for each_item in the_list:
        if isinstance(each_item,list):
            range_help(each_item,level)
        else:
            for count in range(level):
                print(each_item)
