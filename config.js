var dbconfig =
{
  url : "mongodb://localhost:27017/twitter-sentiment"
}

var twitter_tokens =  {
  consumer_key: 'ysAleI7T1Ww9m2XzVPjaj5qRU',
  consumer_secret: 'J28QRycBLELqniO9beCmkkQf4M0W5i3ptZVxKB86wlNEkmC9n5',
  access_token_key: '1533314264-psvgsbn2SoLR0dio8BX5QgSArCpA2zAilOs5vJy',
  access_token_secret: 'ooxjAMuhjahgvr7unGiRvTx86r8NGsvdP4yw9NSKoUTOP'
};


module.exports =
{
  db : dbconfig,
  twitter_tokens : twitter_tokens
}
