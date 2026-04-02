function towsum(num,target){
    for(let i=0;i<num.length;i++){
      for(let j=i+1;j<num.length;j++){
        if(num[i]+num[j]===target){
          return [i,j]
        }
      }
    }
}
let num=[3,2,4]
let target=6
console.log(towsum(num,target))