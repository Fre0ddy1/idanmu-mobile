import axios from 'axios'

const request = axios.create({
  baseURL: 'https://www.idanmu.cc'
})

// 查找设置项
export function getOption() {
  return request.get('/option/option')
}