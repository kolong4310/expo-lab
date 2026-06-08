const { execFileSync } = require('child_process');

const commitMsg = process.argv.slice(2).join(' ').trim();

if (!commitMsg) {
  console.error('Usage: node push.js "Commit message"');
  process.exit(1);
}

try {
  console.log('--- Git auto-push start ---');

  execFileSync('git', ['add', '.'], { stdio: 'inherit' });
  console.log('1. Staged changes');

  execFileSync('git', ['commit', '-m', commitMsg], { stdio: 'inherit' });
  console.log(`2. Committed: ${commitMsg}`);

  execFileSync('git', ['push', 'origin', 'dev'], { stdio: 'inherit' });
  console.log('3. Pushed to origin/dev');
} catch (error) {
  console.error('Auto-push failed:', error.message);
  process.exit(error.status || 1);
}
