import os
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix ---![...] -> ---\n\n![...]
    # Also fix ---# -> ---\n\n#
    content = re.sub(r'---([!#])', r'---\n\n\1', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Walk through posts and call fix_file
for root, dirs, files in os.walk('posts'):
    for file in files:
        if file.endswith('.md'):
            fix_file(os.path.join(root, file))
