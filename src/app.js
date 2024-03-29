const path = require('path')
const chalk = require('chalk')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const express = require('express')
const hbs = require('hbs')

const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Kiran'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Kiran'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helptext: 'This is help page',
        name: 'Kiran'
    })
})


app.get('/weather', (req, res)=>{
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error}) 
            }
            // console.log(forecastData)
            res.send({  
               forecast:forecastData,
               location,
               address: req.query.address 
           })
        }) 
    }) 
})

app.get('/products', (req, res) => {
    if (!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*',(req, res)=>{
    res.render('404',{
        title: 'Help',
        helptext: 'This help article not found',
        name: 'Kiran'
    })
})

app.get('*',(req, res)=>{
    res.render('404',{
        title: 'Help',
        helptext: 'This page not found',
        name: 'Kiran'
    })
})

app.listen(port, () => {
    console.log('Server is up on port'+ port)
})