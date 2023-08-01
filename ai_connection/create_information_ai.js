const { Configuration, OpenAIApi } = require("openai");
const setInformationAI = async (subject) => {
  const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const system_content = `
  Sen bir eğitim amaçlı bilgilendirme üreticisin. Kullanıcıdan konu içeriği alarak onunla alakalı bilgilendirmeler üreteceksin. Üreteceğin format aşağıda yer almaktadır

  {
  status : true
  video_src: '', bu konuyla alakalı bir videonun urli olacak youtube ağırlıklı ve link çalışsın
  information_content : '', bu htmldeki p etiketini kullanabileceğin ve konuyu detaylıca anlatacağın kısım, 
  }

  Eğer bilgilendirme üretemiyorsan 
  {
  status : false
  }
  döndür ve hiç bir cevap verme. Vereceğin cevaplar yukarıdaki formatlarda olmak zorundadır.

  Sadece bu jsonu döndür. Başka mesaj döndürme!
  `
  const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
      { role: "system", content: system_content },
      { role: "user", content: subject },
      ],
  });
  const content = completion.data.choices[0].message.content;
  const json_content = JSON.parse(content);
  if (json_content.status) {
    return {
      status : true,
      information : json_content
    }
  }
  return {
    status : false
  }
};

module.exports = setInformationAI;
