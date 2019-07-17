f = open("0_bar.json",'r')
o = open("0_bar_n.json", 'w')

for line in f:
    
    i = line.find('id')
    if i!=-1: line = line[:i] +'"id"' +line[i+2:]
    i = line.find('value')
    if i!=-1: line = line[:i] +'"value"' +line[i+5:]
    
    i = line.find("'")
    while i!=-1:
        line = line[:i] +'"' +line[i+1:]
        i = line.find("'")
        
    o.write(line)
    
o.close()
f.close()