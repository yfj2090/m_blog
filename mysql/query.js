const db = require('./connect')

function homeInfo() {
    return new Promise(( resolve, reject ) => {
        db.querySql('select * from home', [], function(err, results) {
            console.log(err, results)
            resolve(err)
        })
    })
} 

module.exports = {
    homeInfo
}