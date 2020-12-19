if (process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI: 'mongodb+srv://usertest:123456t8@cluster0.qnqut.mongodb.net/<dbname>?retryWrites=true&w=majority'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
}