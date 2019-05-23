export default function(code, isShift) {
 switch (code) {
  case 48:
  case 49:
  case 50:
  case 51:
  case 52:
  case 53:
  case 54:
  case 55:
  case 56:
  case 57:
   return 'DIGIT';
  case 9:
   return isShift ? 'BACKTAB' : 'TAB';
  case 13:
   return 'ENTER';
  case 27:
   return 'ESCAPE';
  case 32:
   return 'SPACE';
  case 37:
   return 'LEFTARROW';
  case 38:
   return 'UPARROW';
  case 39:
   return 'RIGHTARROW';
  case 40:
   return 'DOWNARROW';
 }
}
