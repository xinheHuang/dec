/**
 * Created by Xinhe on 2017-09-20.
 */

const getCharByte = (char) => {
  let len = 0
  while (char > 0) {
    len++
    char = char >> 8
  }
  return len
}

const stringBytes = (c) => {
  const n = c.length
  let len = 0
  for (let i = 0; i < n; i++) {
    let s = c.charCodeAt(i)
    len += getCharByte(s)
  }
  return len
}

const dotString = (s, maxLen) => {
  let bytes = stringBytes(s)
  // console.log(s,bytes);
  let newStr = s
  if (bytes <= maxLen) {
    return s
  }
  while (bytes + 3 > maxLen) {
    bytes -= getCharByte(newStr.charCodeAt(newStr.length - 1))
    newStr = newStr.slice(0, -1)
  }
  return `${newStr}...`
}


const dateFormat=(date)=>{
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const twoDigitNumber=(number)=> ('0' + number).slice(-2)

const weekDayFormat=(date)=>{
  const weekDay={
    0:'日',1:'一',2:'二',3:'三',4:'四',5:'五',6:'六',
  }
  return `周${weekDay[date.getDay()]}${twoDigitNumber(date.getMonth()+1)}/${twoDigitNumber(date.getDate())}`
}

const dateString=(date)=> date.toISOString()
                              .split('T')[0]
export { dotString ,dateFormat,weekDayFormat,dateString,twoDigitNumber}
