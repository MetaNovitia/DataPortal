"""
Create JSON files - table
Row    => RowKey (Column0) : {Column1, Column2, ... , ColumnN}
Column => ColumnKey (Row0) : {Row1, Row2, ... , RowN}
"""

import csv, json, argparse

# returns csv as dictionary
def readCSV(filename):
    
    result = []
    
    with open(filename, newline='') as csvfile:
        
        csvreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        
        # headers
        headers = next(csvreader)
        headers = [header.strip() for header in headers]
        
        for entry in csvreader:
            
            rowKey = entry[0].strip()
            if rowKey!="":
                
                result.append({"id":str(rowKey),"data":[]})
                for i in range(1,len(headers)):
                    
                    columnKey = headers[i]
                    if columnKey!="":
                        try: value = int(entry[i].strip())
                        except ValueError: 
                            try: value = float(entry[i].strip())
                            except ValueError as s: 
                                value = "ERROR: NOT A NUMBER"
                                print(s,'Row: "'+rowKey+ '" Column: "'+columnKey+'"')
                    
                        result[-1]["data"].append({"x":columnKey,"y":value})
                
    return result
                
        
def writeJSON(outfile,result,title,unit):
    try:
        out = open(outfile, 'r')
        r = json.loads(out.read())
        out.close()
    except: 
        r={}
    
    r[title] = {"data":result,"title":unit}

    out = open(outfile, 'w')
    out.write(json.dumps(r, indent=4))
    out.close()
    

def parse_args():
    """Reads and parses the command-line arguments."""
    parser = argparse.ArgumentParser()

    # required arguments
    required = parser.add_argument_group('required arguments')
    required.add_argument('-i', '--input', metavar='filename', type=str, required=True)
    required.add_argument('-o', '--output', metavar='outfile', type=str, required=True)
    required.add_argument('-t', '--title', metavar='title', type=str, required=True)
    required.add_argument('-u', '--unit', metavar='unit', type=str, required=True)
    return parser.parse_args()
            
def main(args):
    result = readCSV(args.input)
    writeJSON(args.output,result,args.title,args.unit)
    
if __name__ == '__main__':
    main(parse_args())