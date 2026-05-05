import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyA45vqN9_DUfHbe78vmAL909YExchnGlok');

async function test(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
    });
    let ok = false;
    for await (const chunk of result.stream) {
      if (chunk.text()) ok = true;
    }
    console.log('SUCCESS with', modelName);
  } catch (err) {
    console.error('ERROR with', modelName, err.message);
  }
}

async function run() {
  await test('gemini-1.5-flash');
  await test('gemini-pro');
  await test('models/gemini-1.5-flash');
}
run();
