const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk')

/*
WM Yanz Dev 
Ch: https://whatsapp.com/channel/0029Vai7FxK5Ui2TkgHi1P0I
*/

async function twitter(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const twitterUrlMatch = url.match(/(https:\/\/x.com\/[^?]+)/);
      const tMatch = url.match(/t=([^&]+)/);

      const twitterUrl = twitterUrlMatch ? twitterUrlMatch[1] : '';
      const t = tMatch ? tMatch[1] : '';
      const urlnya = encodeURIComponent(`${twitterUrl}?t=${t}&s=19`);

      const response = await axios.post("https://savetwitter.net/api/ajaxSearch", 
      `q=${urlnya}&lang=en`);

      const $ = cheerio.load(response.data.data);

      const videoThumbnail = $('.tw-video .thumbnail .image-tw img').attr('src');
      const downloads = [];

      $('.dl-action a').each((i, elem) => {
        const quality = $(elem).text().trim();
        const url = $(elem).attr('href');

        if ($(elem).hasClass('action-convert')) {
          const audioUrl = $(elem).attr('data-audioUrl');
          downloads.push({
            quality: quality,
            url: audioUrl || 'URL not found',
          });
        } else {
          downloads.push({
            quality: quality,
            url: url
          });
        }
      });

      const title = $('.tw-middle h3').text().trim();
      const videoDuration = $('.tw-middle p').text().trim();
      const twitterId = $('#TwitterId').val();

      const result = {
        title: title,
        duration: videoDuration,
        twitterId: twitterId,
        videoThumbnail: videoThumbnail,
        downloads: downloads
      };

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { twitter }

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})