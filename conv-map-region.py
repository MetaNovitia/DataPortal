"""
Create JSON files - key reference
Header Column : Column1, Column2, ... , ColumnN
Column1: Header Column
Column2: Header Column
...
ColumnN: Header Column
"""

import csv, json, argparse

# returns csv as dictionary
def readCSV(filename):
    
    result = {}
    
    with open(filename, newline='') as csvfile:
        
        csvreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        
        # headers
        headers = next(csvreader)
        for header in headers: result[header] = {}
        
        for entry in csvreader:
            
            # reference headerColumn to column and vice versa
            for i in range(1,len(headers)):
                headerColumn = entry[0]
                column = entry[i]
                
                if column not in result[headers[i]]: 
                    result[headers[i]][column]=[] 
                result[headers[i]][column].append(headerColumn)
                
                if headerColumn not in result[headers[0]]: 
                    result[headers[0]][headerColumn]={}
                result[headers[0]][headerColumn][headers[i]] = column
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