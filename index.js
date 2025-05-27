/*
🔹 Criado por: @Nuken
🔹 Provedor de Serviços: Nex Carisys
🔹 Site Do Provedor: https://carisys.online/
🔹 Copyright © 2025 - Todos os direitos reservados.
🔹 Licença: Uso livre e gratuito para todos os usuários.
*/

const express = require('express');
const fetch = require('node-fetch');
var fs = require('fs')


const app = express();
const PORT = process.env.PORT || 2007;
app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'docs.html'));
});
app.get('/dash', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'docs.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dash.html'));
});
app.get('/host', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'h.html'));
});
app.get('/panel', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'panel.html'));
});
app.get('/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'perfil.html'));
});
app.get('/vips',(req, res) => {
res.sendFile(path.join(__dirname, "./public/", "vips.html"))}); 
app.get('/planos',(req, res) => {
res.sendFile(path.join(__dirname, "./public/", "plano.html"))}); 

const path = require("path");
const { dirname } = require('path');
var __dirname = dirname(__filename);

var key = JSON.parse(fs.readFileSync("./lib/secret/keys.json"));
const users = JSON.parse(fs.readFileSync("./lib/secret/usuarios.json"));

async function loadKeys(apikey, req) {
var i4 = key.map(i => i?.apikey)?.indexOf(apikey)
if(i4 >= 0) {
key[i4].request -= 1;
fs.writeFileSync("./lib/secret/keys.json", JSON.stringify(key, null, 2));
var IP = req.headers['x-real-ip'] || req.connection.remoteAddress || 0;
var i3 = users.map(i => i.key).indexOf(apikey);
if(i3 < 0 && !users.map(i => i.IP).includes(IP?.split(":")[3])){
users.push({key: apikey, IP: [IP?.split(":")[3]]})
fs.writeFileSync("./lib/secret/usuarios.json", JSON.stringify(users, null, 2));
} else if(i3 >= 0 && !users[i3]?.IP.includes(IP?.split(":")[3])) {
users[i3].IP.push(IP?.split(":")[3])
fs.writeFileSync("./lib/secret/usuarios.json", JSON.stringify(users, null, 2));
}}} 

app.get('/api/keyerrada',(req, res) => {
    apikey = req.query.apikey;
    var ITC = key.map(i => i?.apikey)?.indexOf(apikey);
    if(ITC < 0) {
    return res.json({key:'Sua apikey é invalida Ou acabou as requets'})
    } else {return res.json({key:`Sua ApiKey está 100% ✅ - Requests Restantes: ${key[ITC]?.request}`})}})
    

// Função para carregar as chaves existentes do arquivo JSON
let keys = []; // Variável global para armazenar as chaves

// Função para carregar as chaves existentes do arquivo JSON
function loadKeys() {
    const filePath = path.join(__dirname, 'lib', 'secret', 'keys.json');
    if (fs.existsSync(filePath)) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error('Erro ao carregar as chaves:', err);
            return []; // Retorna um array vazio em caso de erro
        }
    }
    return []; // Retorna um array vazio se o arquivo não existir
}

// Função para salvar as chaves no arquivo JSON
function saveKeys(keys) {
    const filePath = path.join(__dirname, 'lib', 'secret', 'keys.json');
    try {
        fs.writeFileSync(filePath, JSON.stringify(keys, null, 2));
    } catch (err) {
        console.error('Erro ao salvar as chaves:', err);
    }
}


keys = loadKeys();


// Middleware para JSON
app.use(express.json());

app.get('/api/add-key', (req, res) => {
    console.log(req.query); // Para depuração
    let a = req.query.a;

    if (!a) {
        return res.json({ resultado: "Parâmetro 'a' é obrigatório" });
    }

    var [apikey, senha, rq] = a.split("|");
    var senhaofc = "0310";

    if (senha !== senhaofc) {
        return res.json({ resultado: "Senha inválida.." });
    }

    if (!apikey) {
        return res.json({ resultado: "Kd a key.." });
    }

    if (keys.map(i => i.apikey).includes(apikey)) {
        return res.json({ resultado: "Essa key já está inclusa dentro do sistema.." });
    } else {
        const requestCount = Number(rq);
        if (isNaN(requestCount) || requestCount <= 0) {
            return res.json({ resultado: "O número de requisições deve ser um número válido e maior que zero." });
        }

        keys.push({ apikey: apikey, request: requestCount });
        saveKeys(keys);

        var ITC = keys.findIndex(i => i.apikey === apikey);
        return res.json({
            resultado: `ApiKey: ${apikey} Foi Adicionada ao Sistema\n🚀\n\nNúmero de Requisições Disponíveis: ${keys[ITC]?.request}`
        });
    }
});

// Rota para deletar chave
app.get('/api/del-key', (req, res) => {
    let apikey = req.query.apikey;
    let senha = req.query.senha;
    var senhaofc = "0310";

    if (!apikey) {
        return res.json({ msg: "Kd a key.." });
    }

    if (!senha) {
        return res.json({ msg: "Kd a senha.." });
    }

    if (senha !== senhaofc) {
        return res.json({ msg: "Senha inválida.." });
    }

    if (!keys.map(i => i.apikey).includes(apikey)) {
        return res.json({ msg: "Essa key não está inclusa.." });
    } else {
        var i2 = keys.map(i => i.apikey).indexOf(apikey);
        keys.splice(i2, 1); // Remove a chave da lista
        saveKeys(keys);

        return res.json({ msg: `apikey ${apikey} deletada com sucesso..` });
    }
});


app.get('/api/pinterest', async (req, res) => { //By @Nuken
    var q = req.query.q;
    var apikey = req.query.apikey;

    if (!q || !apikey) {
        return res.json({ status: false, resultado: 'Parâmetros faltando: q e apikey são necessários.' });
    }

    const apiKeyData = key.find(i => i.apikey === apikey);
    if (!apiKeyData || apiKeyData.request <= 0) {
        return res.sendFile(path.join(__dirname, "./public/", "apikey.html"));
    }

    await loadKeys(apikey, req);


    try {
        let response = await fetch(`https://api.nexfuture.com.br/api/pesquisas/pinterest?query=${encodeURIComponent(q)}`);
        
        if (!response.ok) {
            throw new Error(`Erro na API externa: ${response.statusText}`);
        }

        let buffer = await response.buffer();

        res.setHeader('Content-Type', 'image/jpeg');
        res.send(buffer);
    } catch (error) {
        console.error("Erro ao buscar a imagem:", error);
        res.status(500).json({ error: "Erro ao processar a imagem, tente novamente mais tarde." });
    }//By @Nuken
});

//downloads

app.get('/api/tiktok-src', async (req, res) => {
    var q = req.query.q;
    var apikey = req.query.apikey;

    if (!q || !apikey) {
        return res.json({ status: false, resultado: 'Parâmetros faltando: q e apikey são necessários.' });
    }

    const apiKeyData = key.find(i => i.apikey === apikey);
    if (!apiKeyData || apiKeyData.request <= 0) {
        return res.sendFile(path.join(__dirname, "./public/", "apikey.html"));
    }

    await loadKeys(apikey, req);

    try {
        var response = await fetch(`https://api.nexfuture.com.br/api/pesquisas/tiktok/videos?query=${encodeURIComponent(q)}`);
        var data = await response.json();
        var texto = data.resultado;

        res.json({
            Criador: "@Nuken",
            resultado: texto
        });
    } catch (error) {
        console.error("Erro ao buscar vídeo", error);
        return res.status(500).json({ error: "Erro ao buscar vídeo, tente novamente mais tarde" });
    }
});


app.get('/api/yt-play', async (req, res) => {
    var q = req.query.q;
    var apikey = req.query.apikey;

    if (!q || !apikey) {
        return res.json({ status: false, resultado: 'Parâmetros faltando: q e apikey são necessários.' });
    }

    const apiKeyData = key.find(i => i.apikey === apikey);
    if (!apiKeyData || apiKeyData.request <= 0) {
        return res.sendFile(path.join(__dirname, "./public/", "apikey.html"));
    }

    await loadKeys(apikey, req);

    try {
        var response = await fetch(`https://api.nexfuture.com.br/api/downloads/youtube/play?query=${encodeURIComponent(q)}`);
        var data = await response.json();
        var texto = data.resultado;

        res.json({
            Criador: "@Nuken",
            resultado: texto
        });
    } catch (error) {
        console.error("Erro ao buscar vídeo", error);
        return res.status(500).json({ error: "Erro ao buscar vídeo, tente novamente mais tarde" });
    }
});

app.get('/api/yt-playv2', async (req, res) => {
    var q = req.query.q;
    var apikey = req.query.apikey;

    if (!q || !apikey) {
        return res.json({ status: false, resultado: 'Parâmetros faltando: q e apikey são necessários.' });
    }

    const apiKeyData = key.find(i => i.apikey === apikey);
    if (!apiKeyData || apiKeyData.request <= 0) {
        return res.sendFile(path.join(__dirname, "./public/", "apikey.html"));
    }

    await loadKeys(apikey, req);

    try {
        var response = await fetch(`https://api.nexfuture.com.br/api/downloads/youtube/play/v2?query=${encodeURIComponent(q)}`);
        var data = await response.json();
        var texto = data.resultado;

        res.json({
            Criador: "@Nuken",
            resultado: texto
        });
    } catch (error) {
        console.error("Erro ao buscar vídeo", error);
        return res.status(500).json({ error: "Erro ao buscar vídeo, tente novamente mais tarde" });
    }
});

app.get('/api/instadl/v1', async(req, res) => {
    var url = req.query.url;
    var apikey = req.query.apikey;

    if (!url || !apikey) {
        return res.json({ status: false, resultado: 'Parâmetros faltando: url e apikey são necessários.' });
    }

    const apiKeyData = key.find(i => i.apikey === apikey);
    if (!apiKeyData || apiKeyData.request <= 0) {
        return res.sendFile(path.join(__dirname, "./public/", "apikey.html"));
    }

    await loadKeys(apikey, req);

    try {
         var response = await fetch(`https://carisys.online/api/downloads/instagram/dl/v2?url=${encodeURIComponent(url)}`);

         var data = await response.json()

         var texto = data.resultado

         res.json({
            Criador: "@Nuken",
            provedor: "Nex Carisys",
            resultado: texto
         })
    } catch (error) {
        console.error("Erro ao buscar url", error)
        res.status(500).json({ erro: "Erro ao buscar video."})
    }
})

app.get('/api/youtube-mp3', async (req, res) => {
    var url = req.query.url;
    var apikey = req.query.apikey;

    if (!url || !apikey) {
        return res.json({ status: false, resultado: 'Parâmetros faltando: url e apikey são necessários.' });
    }

    const apiKeyData = key.find(i => i.apikey === apikey);
    if (!apiKeyData || apiKeyData.request <= 0) {
        return res.sendFile(path.join(__dirname, "./public/", "apikey.html"));
    }

    await loadKeys(apikey, req);

    if (!url) {
        return res.status(400).json({ 
            status: false, 
            mensagem: "Cade o parametro url?" 
        });
    }

    try {
        var response = await fetch(`https://carisys.online/api/downloads/youtube/mp3?url=${encodeURIComponent(url)}`);
        var buffer = await response.buffer();
        
        res.setHeader('Content-Type', 'audio/mpeg'); 
        res.setHeader('Content-Disposition', 'attachment; filename="audio.mp3"'); 
        res.send(buffer);
    } catch (error) {
        console.error("Erro ao baixar áudio:", error);
        res.status(500).json({ 
            erro: "Erro ao processar o áudio, tente novamente mais tarde!" 
        });
    }
});




//downloads fim

//plaq começo

app.get('/api/plaq1', async (req, res) => {
    var texto = req.query.texto;
    var apikey = req.query.apikey;

    if (!texto) {
        return res.status(400).json({status: false, message: "cade o parametro texto?"})
    }

    if (!apikey) {
        return res.json({ status: false, resultado: 'Parâmetro apikey são necessários.' });
    }

    const apiKeyData = key.find(i => i.apikey === apikey);
    if (!apiKeyData || apiKeyData.request <= 0) {
        return res.sendFile(path.join(__dirname, "./public", "apikey.html"));
    }

    await loadKeys(apikey, req);

    try {
        var response = await fetch(`https://carisys.online/api/plaquinhas/plaq1?query=${encodeURIComponent(texto)}`);

        var buffer = await response.buffer()

        res.setHeader('Content-Type', 'image/jpeg')
        res.send(buffer);
    }catch (error) {
        console.error("Error ao processar imagem", error);
        res.status(500).json({erro: "Error ao processar imagem. tente novamente mais tarde"});
    }
})
app.get('/api/plaq2', async (req, res) => {
    var texto = req.query.texto;
    var apikey = req.query.apikey;

    if (!texto) {
        return res.status(400).json({status: false, message: "cade o parametro texto?"})
    }

    if (!apikey) {
        return res.json({ status: false, resultado: 'Parâmetro apikey são necessários.' });
    }

    const apiKeyData = key.find(i => i.apikey === apikey);
    if (!apiKeyData || apiKeyData.request <= 0) {
        return res.sendFile(path.join(__dirname, "./public", "apikey.html"));
    }

    await loadKeys(apikey, req);

    if (!texto) {
        return res.status(400).json({status: false, message: "cade o parametro texto?"})
    }

    try {
        var response = await fetch(`https://carisys.online/api/plaquinhas/plaq2?query=${encodeURIComponent(texto)}`);

        var buffer = await response.buffer()

        res.setHeader('Content-Type', 'image/jpeg')
        res.send(buffer);
    }catch (error) {
        console.error("Error ao processar imagem", error);
        res.status(500).json({erro: "Error ao processar imagem. tente novamente mais tarde"});
    }
})
app.get('/api/plaq3', async (req, res) => {
    var texto = req.query.texto;
    var apikey = req.query.apikey;

    if (!texto) {
        return res.status(400).json({status: false, message: "cade o parametro texto?"})
    }

    if (!apikey) {
        return res.json({ status: false, resultado: 'Parâmetro apikey são necessários.' });
    }

    const apiKeyData = key.find(i => i.apikey === apikey);
    if (!apiKeyData || apiKeyData.request <= 0) {
        return res.sendFile(path.join(__dirname, "./public", "apikey.html"));
    }

    await loadKeys(apikey, req);

    if (!texto) {
        return res.status(400).json({status: false, message: "cade o parametro texto?"})
    }

    try {
        var response = await fetch(`https://carisys.online/api/plaquinhas/plaq3?query=${encodeURIComponent(texto)}`);

        var buffer = await response.buffer()

        res.setHeader('Content-Type', 'image/jpeg')
        res.send(buffer);
    }catch (error) {
        console.error("Error ao processar imagem", error);
        res.status(500).json({erro: "Error ao processar imagem. tente novamente mais tarde"});
    }
})
app.get('/api/plaq4', async (req, res) => {
    var texto = req.query.texto;
    var apikey = req.query.apikey;

    if (!texto) {
        return res.status(400).json({status: false, message: "cade o parametro texto?"})
    }

    if (!apikey) {
        return res.json({ status: false, resultado: 'Parâmetro apikey são necessários.' });
    }

    const apiKeyData = key.find(i => i.apikey === apikey);
    if (!apiKeyData || apiKeyData.request <= 0) {
        return res.sendFile(path.join(__dirname, "./public", "apikey.html"));
    }

    await loadKeys(apikey, req);

    if (!texto) {
        return res.status(400).json({status: false, message: "cade o parametro texto?"})
    }

    try {
        var response = await fetch(`https://carisys.online/api/plaquinhas/plaq4?query=${encodeURIComponent(texto)}`);

        var buffer = await response.buffer()

        res.setHeader('Content-Type', 'image/jpeg')
        res.send(buffer);
    }catch (error) {
        console.error("Error ao processar imagem", error);
        res.status(500).json({erro: "Error ao processar imagem. tente novamente mais tarde"});
    }
})
app.get('/api/plaq5', async (req, res) => {
    var texto = req.query.texto;
    var apikey = req.query.apikey;

    if (!texto) {
        return res.status(400).json({status: false, message: "cade o parametro texto?"})
    }

    if (!apikey) {
        return res.json({ status: false, resultado: 'Parâmetro apikey são necessários.' });
    }

    const apiKeyData = key.find(i => i.apikey === apikey);
    if (!apiKeyData || apiKeyData.request <= 0) {
        return res.sendFile(path.join(__dirname, "./public", "apikey.html"));
    }

    await loadKeys(apikey, req);

    if (!texto) {
        return res.status(400).json({status: false, message: "cade o parametro texto?"})
    }

    try {
        var response = await fetch(`https://carisys.online/api/plaquinhas/plaq5?query=${encodeURIComponent(texto)}`);

        var buffer = await response.buffer()

        res.setHeader('Content-Type', 'image/jpeg')
        res.send(buffer);
    }catch (error) {
        console.error("Error ao processar imagem", error);
        res.status(500).json({erro: "Error ao processar imagem. tente novamente mais tarde"});
    }
})
app.get('/api/plaq6', async (req, res) => {
    var texto = req.query.texto;
    var apikey = req.query.apikey;

    if (!texto) {
        return res.status(400).json({status: false, message: "cade o parametro texto?"})
    }

    if (!apikey) {
        return res.json({ status: false, resultado: 'Parâmetro apikey são necessários.' });
    }

    const apiKeyData = key.find(i => i.apikey === apikey);
    if (!apiKeyData || apiKeyData.request <= 0) {
        return res.sendFile(path.join(__dirname, "./public", "apikey.html"));
    }

    await loadKeys(apikey, req);

    if (!texto) {
        return res.status(400).json({status: false, message: "cade o parametro texto?"})
    }

    try {
        var response = await fetch(`https://carisys.online/api/plaquinhas/plaq6?query=${encodeURIComponent(texto)}`);

        var buffer = await response.buffer()

        res.setHeader('Content-Type', 'image/jpeg')
        res.send(buffer);
    }catch (error) {
        console.error("Error ao processar imagem", error);
        res.status(500).json({erro: "Error ao processar imagem. tente novamente mais tarde"});
    }
})

///plaq fim


//ias

app.get('/api/gemini', async(req, res) => {
    var texto = req.query.texto;
    var apikey = req.query.apikey;

    if (!texto) {
        return res.status(400).json({status: false, message: "cade o parametro texto?"})
    }

    if (!apikey) {
        return res.json({ status: false, resultado: 'Parâmetro apikey são necessários.' });
    }

    const apiKeyData = key.find(i => i.apikey === apikey);
    if (!apiKeyData || apiKeyData.request <= 0) {
        return res.sendFile(path.join(__dirname, "./public", "apikey.html"));
    }

    await loadKeys(apikey, req);

    try {
        var response = await fetch(`https://carisys.online/api/inteligencias/gemini?query=${encodeURIComponent(texto)}`);

        var data = await response.json();

        var text = data.resposta

        res.json({Criador: "@Nuken", Provedor: "Nex Carisys", Resposta: text})
    }catch (error) {
        console.error("Error ao processar texto", error)
        res.status(500).json({Erro: "Erro ao processar Texto. Entre em contato com meu dono!!"})
    }
})

//ias fim

//figurinhas

app.get('/api/figale', async(req, res) => {
    var apikey = req.query.apikey;

    if (!apikey) {
        return res.json({ status: false, resultado: 'Parâmetro apikey são necessários.' });
    }

    const apiKeyData = key.find(i => i.apikey === apikey);
    if (!apiKeyData || apiKeyData.request <= 0) {
        return res.sendFile(path.join(__dirname, "./public", "apikey.html"));
    }

    await loadKeys(apikey, req);

    try {
        var response = await fetch(`https://sugoiapi.space/api/figurinhas?apikey=Bot-Academy`)

        var buffer = await response.buffer()

        res.setHeader('Content-Type', 'image/webp')
        res.send(buffer)
    } catch (error) {
        console.error("Error ao processar a api");
        res.status(500).json({ status: false, erro: "Erro ao processar figurinha...Entre em contato com meu dono"})
    }
})


//end

//outos 

app.get('/api/print-site/v1', async (req, res) => {
    var url = req.query.url;
    var apikey = req.query.apikey;

    if (!url) {
        return res.status(400).json({status: false, message: "cade o parametro url?"})
    }

    if (!apikey) {
        return res.json({ status: false, resultado: 'Parâmetro apikey são necessários.' });
    }

    const apiKeyData = key.find(i => i.apikey === apikey);
    if (!apiKeyData || apiKeyData.request <= 0) {
        return res.sendFile(path.join(__dirname, "./public", "apikey.html"));
    }

    await loadKeys(apikey, req);

    try {
        var response = await fetch(`https://api.nexfuture.com.br/api/outros/printsite?url=${encodeURIComponent(url)}`)

        if (!response.ok) {
            throw new Error(`Erro na API externa: ${response.statusText}`);
        }

        var buffer = await response.buffer();

        res.setHeader('Content-Type', 'image/jpeg')
        res.send(buffer);

    }
    catch (error) {
        console.error("Erro ao buscar a imagem:", error);
        res.status(500).json({ error: "Erro ao processar a imagem, tente novamente mais tarde." });
    }//By @Nuken


})

app.get('/api/filmes', async (req, res) => {
    var nome = req.query.nome;
    var apikey = req.query.apikey;

    if (!nome) {
        return res.status(400).json({status: false, message: "cade o parametro nome?"})
    }

    if (!apikey) {
        return res.json({ status: false, resultado: 'Parâmetro apikey são necessários.' });
    }

    const apiKeyData = key.find(i => i.apikey === apikey);
    if (!apiKeyData || apiKeyData.request <= 0) {
        return res.sendFile(path.join(__dirname, "./public", "apikey.html"));
    }

    await loadKeys(apikey, req);

    try {

        var response = await fetch(`https://api.nexfuture.com.br/api/pesquisas/filmes?query=${encodeURIComponent(nome)}`);

        var data = await response.json();

        var texto = data.resultado

        res.json({ 
            Criador: "@Nuken",
            Provedor: "Nex Carisys",
            resultad: texto
        })
    } catch (error) {
        console.error("Error ao porcessar api")
        res.status(500).json({status: false, erro: "Erro ao tentar achar o nome.... entre em contato com o meu dono!!"})
    }
})

app.get('/api/wallpaper', async (req, res) =>{
    var text = req.query.text;
    var apikey = req.query.apikey;

    if (!text) {
        return res.status(400).json({status: false, message: "cade o parametro text?"})
    }

    if (!apikey) {
        return res.json({ status: false, resultado: 'Parâmetro apikey são necessários.' });
    }

    const apiKeyData = key.find(i => i.apikey === apikey);
    if (!apiKeyData || apiKeyData.request <= 0) {
        return res.sendFile(path.join(__dirname, "./public", "apikey.html"));
    }

    await loadKeys(apikey, req);


    try {
        var response = await fetch(`https://api.nexfuture.com.br/api/pesquisas/wallpaper?query=${encodeURIComponent(text)}`);

        var data = await response.json()

        var imagens = data.resultado.filter(url => url !== null);

        res.json({

            Criador: "@Nuken",
            resultados: imagens

        })
    } catch (error) {
        console.error("Erro ao buscar a imagem:", error);
        res.status(500).json({ error: "Erro ao processar a imagem, tente novamente mais tarde." });
    }//By @Nuken
});

app.get('/api/dicionario', async (req, res) => {
    var texto = req.query.texto;
    var apikey = req.query.apikey;

    if (!texto) {
        return res.status(400).json({status: false, message: "cade o parametro texto?"})
    }

    if (!apikey) {
        return res.json({ status: false, resultado: 'Parâmetro apikey são necessários.' });
    }

    const apiKeyData = key.find(i => i.apikey === apikey);
    if (!apiKeyData || apiKeyData.request <= 0) {
        return res.sendFile(path.join(__dirname, "./public", "apikey.html"));
    }

    await loadKeys(apikey, req);


    try {
        var response = await fetch(`https://api.nexfuture.com.br/api/pesquisas/dicionario?query=${encodeURIComponent(texto)}`);

        var data = await response.json()

        var texto = data.resultado

        res.json({
            Criador: "@Nuken",
            resultado: texto
        })

    }catch (error) {
        console.error("Erro ao buscar a imagem:", error);
        res.status(500).json({ error: "Erro ao processar a imagem, tente novamente mais tarde." });
    }//By @Nuken
});

app.get('/api/pensador', async (req, res) => {
    var text = req.query.text;
    var apikey = req.query.apikey;

    if (!text) {
        return res.status(400).json({status: false, message: "cade o parametro text?"})
    }

    if (!apikey) {
        return res.json({ status: false, resultado: 'Parâmetro apikey são necessários.' });
    }

    const apiKeyData = key.find(i => i.apikey === apikey);
    if (!apiKeyData || apiKeyData.request <= 0) {
        return res.sendFile(path.join(__dirname, "./public", "apikey.html"));
    }

    await loadKeys(apikey, req);
    try {
        var response = await fetch(`https://carisys.online/api/outros/pensador?query=${encodeURIComponent(text)}`);

        var data = await response.json()

        var texto = data.resultado

        res.json({
            Criador: "@Nuken",
            Provedor: "Nex Carisys",
            resultado: texto
        })
    } catch (error) {
        console.error("Error ao processar texto", error);
        res.status(500).json({erro: "error ao processar pedido. entre em contato com o meu dono"})
    }
})

//fim


// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
