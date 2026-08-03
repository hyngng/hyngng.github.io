import os

path = 'docs/ai-docs/features/toc.md'
with open(path, 'rb') as f:
    raw = f.read()
last_dash = raw.rfind(b'- \`--toc-item-gap\`')
old_bytes = raw[last_dash:]
print('OLD length:', len(old_bytes))

new_section = (
    b'## 클라이언트 DOM 쿼리 중복\r\n'
    b'\r\n'
    b'\`PostLayout.astro\`에서 이미 \`headings\` props로 계층 구조 데이터를 전달했음에도, '
    b'클라이언트 \`TOC.astro\`의 ScrollSpy 로직은 \`astro:page-load\` 이벤트에서 다시 '
    b'DOM을 쿼리(\`document.querySelectorAll(\'.post-content h2, h3, h4\')\`)하여 heading '
    b'목록을 획득함. 이는 Astro Islands 아키텍처의 특성상 클라이언트에서 독립적으로 '
    b'동작해야 하므로 불가피하나, 불필요한 DOM 쿼리 중복으로 볼 수 있음.\r\n'
    b'\r\n'
    b'**향후 개선 방향**: \`PostLayout\`에서 \`data-heading-list\` 속성으로 직렬화된 '
    b'heading 데이터를 전달하고, 클라이언트에서 DOM 쿼리 없이 바로 사용하는 방식으로 '
    b'변경 권장.\r\n'
    b'\r\n'
)
new_end = b'- \`--toc-item-gap\`: 항목 간격.\r\n\r\n' + new_section + b'## 검증\r\n\r\n\`npm run build\` 통과 확인함.\r\n'
new_file = raw[:last_dash] + new_end
print('New file size:', len(new_file), 'old:', len(raw))
with open(path, 'wb') as f:
    f.write(new_file)
print('File updated successfully')
