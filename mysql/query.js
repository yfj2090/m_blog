const db = require('./connect')

function homeInfo() {
    return new Promise(( resolve, reject ) => {
        db.querySql('select * from home', [], function(err, results) {
            console.log(err[0], results)
            resolve(err[0])
        })
    })
} 

module.exports = {
    homeInfo
}