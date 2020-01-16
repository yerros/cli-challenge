#!/usr/bin/env node

//Bypass SSL error
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const prog = require('caporal');

//
const os = require('os');
const fs = require('fs')
const fsu = require('fsu');

const getIP = require('external-ip')();
const Screenshot = require('url-to-screenshot')

const rp = require('request-promise');
const $ = require('cheerio');
const axios = require('axios');

// #1 String Transformation
prog
    .command('lowercase', 'Mengubah huruf kecil')
    .argument('<text>', 'string yang akan kita proses')
    .action(function(args, option, logger){
        console.log(args.text.toLowerCase());
    });

prog
    .command('uppercase', 'Mengubah huruf besar')
    .argument('<text>', 'String yang akan kita proses')
    .action(function(args, option, logger){
        console.log(args.text.toUpperCase());
    });   
    
prog
    .command('capitalize', 'Mengubah huruf besar di awal kalimat')
    .argument('<text>', 'String yang akan kita proses')
    .action(function(args, option, logger){
        let text = args.text.split(' ')
        for(let i=0; i < text.length; i++){
            text[i] = text[i].charAt(0).toUpperCase() + text[i].slice(1)
        }
        let result = text.join(' ')
        console.log(result);
    }); 


// #2 Arithmetic
prog
    .command('add', 'Penjumlahan')
    .argument('[number...]', 'Number yang akan kita proses')
    .action(function(args, option, logger){
        var res = 0;
        for(let i=0; i < args.number.length; i++){
            res += parseInt(args.number[i])
        }
        console.log(res);
    });

prog
    .command('subtract', 'Pengurangan')
    .argument('[number...]', 'Number yang akan kita proses')
    .action(function(args, option, logger){
        var res = args.number[0]
        for(let i=1; i < args.number.length; i++){          
            res -= parseInt(args.number[i])
        }
        console.log(res);
    });

prog
    .command('multiply', 'Perkalian')
    .argument('[number...]', 'Number yang akan kita proses')
    .action(function(args, option, logger){
        var res = args.number[0]
        for(let i=1; i < args.number.length; i++){          
            res *= parseInt(args.number[i])
        }
        console.log(res);
    });

prog
    .command('divide', 'Pembagian')
    .argument('[number...]', 'Number yang akan kita proses')
    .action(function(args, option, logger){
        var res = args.number[0]
        for(let i=1; i < args.number.length; i++){          
            res /= parseInt(args.number[i])
        }
        console.log(res);
    });


// Palidrom
prog
    .command('palindrome', 'Memeriksa Palindrom')
    .argument('<text>', 'string yang akan kita proses')
    .action(function(args, option, logger){
        let ori = args.text.replace(/\W/g, '').toLowerCase()
        let check = ori.split('').reverse().join('')
        if(check == ori){
            console.log('Is palindrome? Yes');
        } else {
            console.log('Is palindrome? No');
        }
        
    });

// # Obfuscate

prog
    .command('obfuscate')
    .argument('<message>')
    .action((args, option, logger) => {
        const obfuscated = args.message.split('')
            .map(letter => `&#${letter.charCodeAt()}`)
            .join('')

        console.log(obfuscated);
    }) 

// #5 Random String
prog
    .command('random')
    .option('--length <text>', '', prog.INT, 32)
    .option('--leters <text>', '', prog.BOOL, true)
    .action(function(args, option, logger) {
        console.log(option);
        let res = '';
        let kamus = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for(let i = 0; i <= option.length; i++){
            kamus = kamus.replace(Number, '')
            res  += kamus.charAt(Math.floor(Math.random() * kamus.length));
            console.log(kamus);
        }
        console.log(res);
    })

// #6 Get IP Address in private network
prog
    .command('ip', 'Mengubah huruf kecil')
    .action(function(){
        var ifaces = os.networkInterfaces();
        //console.log(ifaces);
        Object.keys(ifaces).forEach(function (ifname) {
            var alias = 0;

            ifaces[ifname].forEach(function (iface) {
                if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
                }

                if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                console.log(ifname + ':' + alias, iface.address);
                } else {
                // this interface has only one ipv4 adress
                console.log(iface.address);
                }
                ++alias;
            });
        });
    });


// Get External IP Address
prog
.command('ip-external', 'Mendapatkan External Ip address')
.action(function(){
    getIP((err, ip) => {
        if (err) {
            // every service in the list has failed
            throw err;
        }
        console.log(ip);
    });
});


// #8 Get headlines from https://www.kompas.com/
prog
    .command('headlines', 'Get headline from Kompas.com')
    .action(function(){
        const url = 'https://www.kompas.com';

        rp(url)
            .then(function(html){
                var resultObj = []
                
                for(let i = 0; i < 3; i++){
                    const link = $('a.headline__thumb__link', html)[i].attribs.href
                    const title = $('.headline__thumb__img > img', html)[i].attribs.alt
                    resultObj.push({
                        Title: title,
                        URL: link
                    })
                }
                console.log(resultObj);
            })
            .catch(function(err){
                console.log('Something errors found');
            });
    })

// #9 Import/Export CSV/XLS/XLSX file.


// #10 Get a screenshot from a URL
prog
    .command('screenshot', 'Mengubah huruf kecil')
    .argument('<url>', 'URL yang akan kita proses')
    .option('--format <type>', 'Format <type> for screenshot', prog.STRING,'png')
    .option('--output')
    .action(async function(args, option , logger){

        new Screenshot(args.url)
            .width(800)
            .height(600)
            .ignoreSslErrors()
            .capture()
            .then(img => {
                if(option.output){
                    fs.writeFileSync(`${__dirname}/${option.output}`, img)
                } else {
                    fsu.writeFileUnique(`screenshot{-###}.${option.format}`, img)
                }
                console.log('File Saved')
            })
    });


// #11 Get Movie
prog
    .command('movies', 'Get movies from 21cinemaplex')
    .action(function(){
        const url = 'https://21cineplex.com/comingsoon';
        axios.get(url).then(res => { 
          for(let i=0; i < 3; i++){
            const link = $('.movie > a', res.data)[i].attribs.href
            axios.get(link).then(response => {
              const judul = $('.desc-box > h2', response.data).text()
              const genre = $('.movie_genre', response.data).text()
              const produser = $('.movie_produser', response.data).text()
        
              const sutradara = $('.movie_director', response.data).text()
              const penulis = $('.movie_writer', response.data).text()
              const produksi = $('.movie_distributor', response.data).text()
              const cast = $('.movie_cast', response.data).text()
              const sinopsis = $('.desc-synopsis', response.data).text()
        
              const result = judul + genre + produser + sutradara + penulis + produksi + cast + sinopsis
        
                console.log(result);
            })
          }
        })
    })


prog.parse(process.argv)

