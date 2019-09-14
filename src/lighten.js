export default function lighten(col) {
  
    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16);
    var b = ((num >> 8) & 0x00FF);
    var g = (num & 0x0000FF);

    var amt = (660-r-g-b)/3;

    r+=amt;
    b+=amt;
    g+=amt;

    if(r>255) r = 255;
    if(r<150) r = 150;
    if(g>255) g = 255;
    if(g<150) g = 150;
    if(b>255) b = 255;
    if(b<150) b = 150;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  
}