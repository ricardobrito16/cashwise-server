const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const mercadopago = require('mercadopago');

const app = express();
const port = 21104;

app.use(express.static('public'));
app.use(bodyParser.json());

const clientId = '7597245517767996';
const clientSecret = 'APP_USR-7597245517767996-060714-71ae44b2651aa649841a6dc71010db48-73298995';

mercadopago.configure({
  access_token: clientSecret,
});

// Middleware personalizado para adicionar cabeçalhos Access-Control-Allow-Origin e Access-Control-Allow-Headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://tritechsolutions.com.br');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', (req, res) => {
  res.send('Ola, NodeJS versao ' + process.version);
});

app.get('/create-preference', async (req, res) => {
  try {
    const preference = {
      items: [
        {
          title: 'Produto 1',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: 1.0,
        },
      ],
      back_urls: {
        success: 'https://tritechsolutions.com.br/pagamentoaprovado',
        failure: 'https://tritechsolutions.com.br/pagamentoaprovado',
        pending: 'https://tritechsolutions.com.br/pagamentoaprovado',
      },
      auto_return: 'approved',
      payment_methods: {
        installments: 12,
      },
    };

    const createdPreference = await mercadopago.preferences.create(preference);
    console.log('Resultado da criação da preferência de pagamento:', createdPreference.body);
    res.json(createdPreference.body.id);
  } catch (error) {
    console.error('Ocorreu um erro ao criar a preferência de pagamento:', error);
    res.status(500).json({ error: 'Erro ao criar a preferência de pagamento' });
  }
});

app.post('/create-preference', async (req, res) => {
  try {
    const preference = {
      items: [
        {
          title: 'Produto 1',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: 1.0,
        },
      ],
      back_urls: {
        success: 'https://tritechsolutions.com.br/pagamentoaprovado',
        failure: 'https://tritechsolutions.com.br/pagamentoaprovado',
        pending: 'https://tritechsolutions.com.br/pagamentoaprovado',
      },
      auto_return: 'approved',
      payment_methods: {
        installments: 12,
      },
    };

    const createdPreference = await mercadopago.preferences.create(preference);
    console.log('Resultado da criação da preferência de pagamento:', createdPreference.body);
    res.json(createdPreference.body.id);
  } catch (error) {
    console.error('Ocorreu um erro ao criar a preferência de pagamento:', error);
    res.status(500).json({ error: 'Erro ao criar a preferência de pagamento' });
  }
});

const options = {
  key: fs.readFileSync('/home/apitritechsolutions/apps_nodejs/cashwise/ssl/privkey.pem'),
  cert: fs.readFileSync('/home/apitritechsolutions/apps_nodejs/cashwise/ssl/cert.pem'),
};

https.createServer(options, app).listen(port, () => {
  console.log('App de exemplo rodando na porta ' + port);
});
