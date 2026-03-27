import fs from 'fs/promises';
import { globSync } from 'glob';

async function run() {
  const files = globSync('*.html');
  for (const file of files) {
    let content = await fs.readFile(file, 'utf8');
    const regex = /(<li><a href="contact\.html" class="nav-link[^>]*>Contact<\/a><\/li>)/g;
    
    if (regex.test(content) && !content.includes('href="auth.html"')) {
      content = content.replace(regex, '$1\n        <li><a href="auth.html" class="nav-link"><i class="fas fa-user-circle"></i> Login</a></li>');
      await fs.writeFile(file, content);
      console.log('Updated ' + file);
    }
  }
}
run();
