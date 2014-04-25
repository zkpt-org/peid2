from data.functions import chronic, timewindow

def conditions(das):
    tw   = timewindow(das)
    cond = chronic(das, tw)
    return cond
