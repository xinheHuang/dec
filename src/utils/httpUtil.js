import httpUtils from 'axios'
// import swal from 'sweetalert'
import EventBus from '../eventBus'

// class ApiError extends Error {
//   constructor(code, message) {
//     super()
//     this.code = code
//     this.message = mesasge
//   }
// }

const methods = ['get', 'put', 'post', 'delete']
methods.forEach((method) => {
  const fn = httpUtils[method]
  httpUtils[method] = async (...args) => {
    try {
      const res = await fn(...args)
      console.log(method, args,res.data)
      const {code, message, data} = res.data
      if (code == 0) {  //success
        return data
      } else {
        // do some error handle here
        EventBus.$emit('errorDialog', {
          text: message,
        })
        return Promise.reject(message);
      }
    } catch (error) {
      // if (!error instanceof ApiError) {  //非逻辑错误
        const {status} = error.response
        if (status == 403) { //not login
          console.log('should login')
          EventBus.$emit('login')
        }
      return Promise.reject(error);
    }
  }
})

export default httpUtils
