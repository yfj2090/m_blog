const mysql = require('mysql')

// 数据库信息
const db_config = {
    host: 'localhost',
    user: 'root',
    password: 'yfj123',
    database: 'm_blog'
}

// 关闭数据库
function closeMysql(connect) {
    connect.end((err) => {
        if (err) {
            console.log(`mysql关闭失败：${err}!`)
        } else {
            console.log('mysql关闭成功!')
        }
    })
}

module.exports = {
    querySql(sqlQuery, params, callback) {
        const connection = mysql.createConnection(db_config)
        // 开始连接数据库
        connection.connect(function(err) {
            if (err) {
                callback(err, '连接失败', null);
            } else {
                connection.query(sqlQuery, params, function(err, result, fields) {
                    if (err) {
                        callback(err, `SQL error: ${err}!`, null)
                    } else {
                        callback(JSON.parse(JSON.stringify(result)))

                        closeMysql(connection)
                    }
                })
            }
        })
    }
}
