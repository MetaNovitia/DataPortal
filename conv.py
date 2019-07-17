"""
Create JSON files - table
Row    => RowKey (Column0) : {Column1, Column2, ... , ColumnN}
Column => ColumnKey (Row0) : {Row1, Row2, ... , RowN}
"""

import csv, json, argparse

# returns csv as dictionary
def readCSV(filename):
    
    result = {'Column': {}, 'Row': {}}
    
    with open(filename, newline='') as csvfile:
        
        csvreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        
        # headers
        headers = next(csvreader)
        headers = [header.strip() for header in headers]
        for columnKey in headers[1:]: 
            if(columnKey!=""): result['Column'][columnKey] = {}
        
        for entry in csvreader:
            
            rowKey = entry[0].strip()
            if rowKey!="":
                
                result['Row'][rowKey] = {}
                for i in range(1,len(headers)):
                    
                    columnKey = headers[i]
                    if columnKey!="":
                        try: value = int(entry[i].strip())
                        except ValueError: 
                            try: value = float(entry[i].strip())
                            except ValueError as s: 
                                value = "ERROR: NOT A NUMBER"
                                print(s,'Row: "'+rowKey+ '" Column: "'+columnKey+'"')
                    
                        # cross reference
                        result['Column'][columnKey][rowKey] = value
                        result['Row'][rowKey][columnKey] = value
                
    return result
                
        
def writeJSON(outfile,result):
    
    out = open(outfile, 'w')
    out.write(json.dumps(result, indent=4))
    out.close()
    

def parse_args():
    """Reads and parses the command-line arguments."""
    parser = argparse.ArgumentParser()

    # required arguments
    required = parser.add_argument_group('required arguments')
    required.add_argument('-i', '--input', metavar='filename', type=str, required=True,
                          help='path to the initial cell configuration')
    required.add_argument('-o', '--output', metavar='outfile', type=str, required=True,
                          help='path to the initial cell configuration')
    return parser.parse_args()
            
def main(args):
    result = readCSV(args.input)
    writeJSON(args.output,result)
    
if __name__ == '__main__':
    main(parse_args())