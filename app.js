const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Postagem')
const Postagem = mongoose.model('postagens')
require('./models/Categoria')
const Categoria = mongoose.model('categorias')
const usuarios = require('./routes/usuario')
const passport = require('passport')
require('./config/auth')(passport)



    app.use(session({
        secret: 'cursodenode',
        resave: true,
        saveUnitialized: true
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())

    app.use((req,res,next)=>{
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        res.locals.error = req.flash('error')
        res.locals.user = req.user || null
        next()
    })
    
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
    
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/blogapp',{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=>{
    }).then(function(){
        console.log ('Conectado ao mongo')
    }).catch((err)=>{
        console.log (`Erro ao se conectar! ${err}`)
    })
    
    app.use(express.static(path.join(__dirname,'public')))

    

    app.get('/', (req,res)=>{
        Postagem.find().lean().populate('categoria').sort({data: 'desc'}).then((postagens)=>{
            res.render('index', {postagens: postagens})   
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno!')
            res.redirect('/404')
        })
        
    })

    app.get('/postagem/:slug',(req,res)=>{
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem)=>{
            if(postagem){
                res.render('postagem/index', {postagem: postagem})
            }else{
                req.flash('error_msg', 'Houve um erro exibir a postagem!')
                res.redirect('/')
            }
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno!')
            res.redirect('/404')
        })
    })

    app.get('/categorias', (req,res) => {
        Categoria.find().lean().then((categorias)=>{
            res.render('categorias/index', {categorias: categorias})
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno!')
            res.redirect('/404')
        })
    })

    app.get('/categorias/:slug', (req,res)=>{
        Categoria.findOne({slug: req.params.slug}).lean().then((categoria)=>{
            if(categoria){
                Postagem.find({categoria: categoria._id}).lean().then((postagens)=>{
                    res.render('categorias/postagens', {postagens: postagens, categoria: categoria})
                }).catch((err)=>{
                    req.flash('error_msg', 'Houve um erro ao listar as postagens!')
                    res.redirect('/categorias')
                })                
            }else{
                req.flash('error_msg', 'Houve um erro ao tentar exibir a categoria!')
                res.redirect('/categorias')
            }
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno!')
            res.redirect('/404')
        })
    })

    app.get('/404', (req,res)=>{
        res.send ('Erro 404')
    })

    
    app.use('/admin', admin)
    app.use('/usuarios', usuarios)


const PORT = 1982
app.listen(PORT,()=>{
    console.log (`Servidor rodando na porta ${PORT}`)
})