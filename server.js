const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');

const bodyParser = require('body-parser');


const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const mongoURI = 'mongodb://anirudhmv77:anadlave@ac-lnwmqip-shard-00-00.rae2l5s.mongodb.net:27017,ac-lnwmqip-shard-00-01.rae2l5s.mongodb.net:27017,ac-lnwmqip-shard-00-02.rae2l5s.mongodb.net:27017/?ssl=true&replicaSet=atlas-qbvx8e-shard-0&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true, })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log(error));


const urlSchema = new mongoose.Schema({
  fullurl: String,
  note: String,
  shorturl: String,
  shortlink: String,
  clicks: {
    type: Number,
    default: 0

  }
});

const URL = mongoose.model('URL', urlSchema);


app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', async (req, res) => {
  const { fullurl, note } = req.body;
  const shorturl = shortid.generate();
  const siteurl=req.protocol+'://'+req.get('host');
  const shortlink=siteurl+'/redirect/'+shorturl;
  

  const url = new URL({
    fullurl,
    note,
    shorturl,
    shortlink
  });

  await url.save();

  res.redirect(`/details/${shorturl}`);
});


app.post('/search', async (req, res) => {
  const { Search_url } = req.body;
  const results = await URL.find({
    $or: [
      { fullurl: Search_url  },
      { note: Search_url  },
      
      { shorturl: Search_url  },
    ],
  });
  res.render('search', { results, Search_url });
});


app.get('/database', async (req, res) => {
  const data = await URL.find();
  res.render('database', { data });
});

app.get('/details/:shorturl', async (req, res) => {
  const { shorturl } = req.params;

  const url = await URL.findOne({ shorturl });
  if (!url) {
    res.send('URL not found');
    return;
  }

  res.render('details', { details: url });
});

app.get('/redirect/:shorturl', async (req, res) => {
  const { shorturl } = req.params;

  const url = await URL.findOne({ shorturl });
  if (!url) {
    res.send('URL not found');
    return;
  }

  url.clicks++;
  await url.save();
  res.redirect(url.fullurl);
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
