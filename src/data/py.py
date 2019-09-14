import json
f=open("ns.json",'w')

d = {"Basin":[{},{}],"Region":[{},{}],"All":[{},{}]}

for i in range (1,406):
    
    
    if i not in d["Basin"][0]: d["Basin"][0][i] = []
    d["Basin"][0][i].append(str(i))
    d["Basin"][1][i] = str(i)
    
    if i//40 not in d["Region"][0]: d["Region"][0][i//40] = []
    d["Region"][0][i//40].append(str(i))
    d["Region"][1][i] = str(i//40)
    
    if 0 not in d["All"][0]: d["All"][0][0] = []
    d["All"][0][0].append(str(i))
    d["All"][1][i] = "0"
    
f.write(json.dumps(d))

f.close()