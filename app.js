#!/usr/bin/env node
const prog = require('caporal');

//
const os = require('os');
const fs = require('fs')
const fsu = require('fsu');

const getIP = require('external-ip')();
const Screenshot = require('url-to-screenshot')

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


// #5 Random String


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


// #9 Import/Export CSV/XLS/XLSX file.


// #10 Get a screenshot from a URL
prog
    .command('screenshot', 'Mengubah huruf kecil')
    .argument('<url>', 'URL yang akan kita proses')
    .option('--format <type>', 'Format <type> for screenshot', prog.STRING,'png')
    .action(async function(args, option , logger){
        new Screenshot(args.url)
            .width(800)
            .height(600)
            .capture()
            .then(img => {
                fsu.writeFileUnique(`screenshot{-###}.${option.format}`, img)
                console.log('File Saved')
            })
    });

prog.parse(process.argv)


function fileName (){
    let file = 'screenshot-001';
    const checkFile = fs.exists(file)
    console.log(checkFile);
}