const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');

const laptopData = JSON.parse(json);

const server = http.createServer( (request, response) => {

    const pathName = url.parse(request.url, true).pathname;
    const id = url.parse(request.url, true).query.id;

    if(pathName === '/products' || pathName === '/'){
        response.writeHead(200, {'Content-Type': 'text/html'});    
        
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;

            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
                
                const cardsOutput = laptopData.map( el => replaceTemplate(data, el)).join('');

                overviewOutput = overviewOutput.replace('-!CARDS!-', cardsOutput);
            
                response.end(overviewOutput);
            });
        });

    }else if (pathName === '/laptop' && id < laptopData.length){
        response.writeHead(200, {'Content-Type': 'text/html'});   
        
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {

            const laptop = laptopData[id];         
            const output = replaceTemplate(data, laptop);
            response.end(output);
        });

    }else if((/\.(jpg|jpeg|png|gif)$/i).test(pathName)){

        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            response.writeHead(200, {'Content-Type': 'image/jpeg'});
            response.end(data);
        });
    }else{
        response.writeHead(404, {'Content-Type': 'text/html'});   
        response.end('Ops, page not found =/');
    }
});

server.listen(1337, '127.0.0.1' , () => {
    
});

const replaceTemplate = (originalHTML, laptop) => {

    let output = originalHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);

    return output;
};