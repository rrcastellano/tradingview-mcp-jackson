import re
import os
import base64
import sys

def image_to_base64(path):
    # Remove file:// prefix if present
    path = path.replace('file://', '')
    if not os.path.isabs(path):
        # Resolve relative to current working directory if not absolute
        path = os.path.abspath(path)
    
    if not os.path.exists(path):
        print(f"Warning: Image not found at {path}", file=sys.stderr)
        return None
        
    with open(path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        # Simple extension detection
        ext = os.path.splitext(path)[1][1:].lower()
        if ext == 'jpg': ext = 'jpeg'
        return f"data:image/{ext};base64,{encoded_string}"

def process_markdown(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Regex to find ![alt](path) or <img src="path">
    # Supporting both absolute and relative paths
    def replace_match(match):
        alt = match.group(1)
        path = match.group(2)
        
        # If path is remote (http), skip
        if path.startswith('http'):
            return match.group(0)
            
        # If relative to the md file, resolve it
        if not (os.path.isabs(path.replace('file://', '')) or path.startswith('http')):
            md_dir = os.path.dirname(os.path.abspath(file_path))
            path = os.path.join(md_dir, path.replace('file://', ''))
            
        # Clean file:// if we are in absolute mode
        path = path.replace('file://', '')
        
        base64_data = image_to_base64(path)
        if base64_data:
            return f"![{alt}]({base64_data})"
        return match.group(0)

    # Match ![alt](path)
    content = re.sub(r'!\[(.*?)\]\((.*?)\)', replace_match, content)
    
    return content

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 md_to_base64.py <input.md>")
        sys.exit(1)
    
    input_md = sys.argv[1]
    result = process_markdown(input_md)
    # Output to stdout or a temporary file
    print(result)
