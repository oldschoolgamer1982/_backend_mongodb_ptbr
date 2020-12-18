if (process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI: 'mongodb+srv://osg1982:gb9913@cluster0.qnqut.mongodb.net/Cluster0?retryWrites=true&w=majority'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
}