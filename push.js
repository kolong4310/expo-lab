const { execSync } = require('child_process');

try {
    console.log('--- Git 자동 푸시 시작 ---');
    
    // 1. 모든 변경사항 스테이징
    execSync('git add .');
    console.log('1. 변경사항 스테이징 완료');

    // 2. 커밋 메시지 생성 (현재 시간 포함)
    const commitMsg = `Auto-push: ${new Date().toLocaleString()}`;
    execSync(`git commit -m "${commitMsg}"`);
    console.log(`2. 커밋 완료: ${commitMsg}`);

    // 3. GitHub로 푸시
    execSync('git push origin main');
    console.log('3. GitHub 푸시 성공! 🚀');

} catch (error) {
    console.error('❌ 에러 발생:', error.message);
}
