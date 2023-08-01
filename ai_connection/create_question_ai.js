const { Configuration, OpenAIApi } = require("openai");
const setQuestionAI = async (subject) => {
  const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const system_content = `
  Sen bir eğitim amaçlı soru üreticisin. Kullanıcıdan konu içeriği alarak onunla alakalı sorular üreteceksin. Üreteceğin format aşağıda yer almaktadır

  {
  status : true
  level : Soru Seviyesi, easy | medium | hard | very-hard olabilir
  type : Soru Tipi, resimli ise image, resimsiz ise standart
  content : Soru İçeriği
  a : A şıkkı
  b : B şıkkı
  c : C şıkkı
  d : D şıkkı
  answer : Soru Cevabı A ise 1, B ise 2, C ise 3, D ise 4
  }

  Eğer soru üretemiyorsan 
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
      question : json_content
    }
  }
  return {
    status : false
  }
};

module.exports = setQuestionAI;
