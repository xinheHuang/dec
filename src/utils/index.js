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
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export { dotString ,dateFormat}
