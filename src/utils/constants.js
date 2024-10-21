console.log(process.env)
let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-td8m.onrender.com'
}
export const API_ROOT = apiRoot
// export const API_ROOT = 'https://trello-api-td8m.onrender.com'
//http://localhost:8017/
