import os
import re

def transform_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Frontmatter
    lines = content.split('\n')
    fm_start = -1
    fm_end = -1
    for i, line in enumerate(lines):
        if line.strip() == '---':
            if fm_start == -1:
                fm_start = i
            else:
                fm_end = i
                break
    
    if fm_start != -1 and fm_end != -1:
        fm_content = lines[fm_start+1:fm_end]
        new_fm = []
        categories = ""
        tags = ""
        
        for line in fm_content:
            if line.strip().startswith('redirect_from:'):
                continue
            elif line.strip().startswith('categories:'):
                categories = line.strip()
            elif line.strip().startswith('tags:'):
                tags = line.strip()
            else:
                new_fm.append(line)
        
        new_content_fm = '---\n' + '\n'.join(new_fm) + '\n---\n\n'
        # The body is everything after fm_end
        body = '\n'.join(lines[fm_end+1:])
        
        # Add categories and tags to the bottom
        footer = f"\n\n<!--\n{categories}\n{tags}\n-->"
        content = new_content_fm + body + footer

    # 2. Embeds
    # Convert {% include embed/video.html ... %}
    content = re.sub(r'{%\s*include\s+embed/video\.html\s+src=[\'"]([^\'"]+)[\'"].*?%}', r'::video{src="\1"}', content, flags=re.DOTALL)
    # Convert {% include embed/youtube.html ... %}
    content = re.sub(r'{%\s*include\s+embed/youtube\.html\s+id=[\'"]([^\'"]+)[\'"].*?%}', r'::youtube{id="\1"}', content, flags=re.DOTALL)

    # 3. Comments
    content = re.sub(r'{%\s*comment\s*%}(.*?){%\s*endcomment\s*%}', r'<!-- \1 -->', content, flags=re.DOTALL)
    
    # 4. Code Blocks
    content = re.sub(r'```([a-zA-Z]*)\s+filename="[^"]+"', r'```\1', content)

    # 5. Filepath
    content = re.sub(r'\{ \.filepath \}', '', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Walk through posts and call transform_file
for root, dirs, files in os.walk('posts'):
    for file in files:
        if file.endswith('.md'):
            transform_file(os.path.join(root, file))
