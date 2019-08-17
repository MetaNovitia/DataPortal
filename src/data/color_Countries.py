import json


def read():
    f = open("map.json",'r')
    obj = json.loads(f.read())
    f.close()
    return obj
    
def save(obj):
    f = open("Countries.json",'w')
    f.write(json.dumps(obj,indent=4))
    f.close()
    
    
def main():
    d = read()
    print(d.keys())
    save(d)
    
main()