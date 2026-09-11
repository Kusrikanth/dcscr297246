export function formatNumber(num: number) {
    if (num < 1000) {
      return num; 
    } else if (num < 100000) {
      return (num / 1000).toFixed(2) + "K"; 
    } else if (num < 10000000) {
      return (num / 100000).toFixed(2) + "L";
    }else {
      return (num / 10000000).toFixed(2) + "Cr";
    }
}