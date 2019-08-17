import json
f = open("water.json",'r')
d = json.loads(f.read())
f.close()

f = open("water.json",'r')
d2 = json.loads(f.read())
f.close()

for i in d2["topics"]["1980-2017_livestock_tot_wat_consume"]:
    for j in d2["topics"]["1980-2017_livestock_tot_wat_consume"][i]:
        
        if len(j)>4:
            d["topics"]["1980-2017_livestock_tot_wat_consume"][i][j[:4]] = d["topics"]["1980-2017_livestock_tot_wat_consume"][i][j]
            d["topics"]["1980-2017_livestock_tot_wat_consume"][i].pop(j)
            
            
f = open("water_n.json",'w')
f.write(json.dumps(d,indent=4))
f.close()