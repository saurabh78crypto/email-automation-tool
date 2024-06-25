import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);


const categorizeEmail = async (email) => {
    const prompt = `Caategorize the following email: ${email.text}`;
    const response = await openai.createCompletion({ model: 'text-davinci-003', prompt, max_tokens: 10 });
    return response.data.choices[0].text.trim();
};


const generateReply = async (category, email) => {
    let prompt;
    if(category === 'Interested') {
        prompt = `Generate a reply to the following email suggesting a demo call: ${email.text}`;
    } else if(category === 'Not Interested') {
        prompt = `Generate a polite decline reply to the following email: ${email.text}`;
    } else if(category === 'More Information') {
        prompt = `Generate a reply asking for more information to the following email: ${email.text}`;
    }

    const response = await openai.createCompletion({ model: 'text-davinci-003', max_tokens: 100 });
    return response.data.choices[0].text.trim();
};


export { categorizeEmail, generateReply }