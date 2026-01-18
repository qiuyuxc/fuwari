import os
import re
import requests
import hashlib
import json
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlparse

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
CONTENT_DIR = PROJECT_ROOT / "src" / "content" / "posts"
IMG_DIR = PROJECT_ROOT / "src" / "content" / "img"
MAPPING_FILE = PROJECT_ROOT / "scripts" / "url_mapping.json"

# Regex for Markdown images and HTML img tags
MD_IMG_PATTERN = re.compile(r'!\[.*?\]\((http[s]?://[^\)]+)\)')
HTML_IMG_PATTERN = re.compile(r'<img.*?src=["\'](http[s]?://[^"\']+)["\']')
YAML_IMG_PATTERN = re.compile(r'^\s*image:\s*["\']?(http[s]?://[^\s"\']+)["\']?', re.MULTILINE)

# Extensions to save
VALID_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif', '.bmp', '.ico', '.tiff'}

def get_extension(url):
    path = urlparse(url).path
    ext = os.path.splitext(path)[1].lower()
    if ext in VALID_EXTENSIONS:
        return ext
    return '.jpg' # Default fallback

def download_image(url):
    try:
        # Generate filename based on URL hash
        url_hash = hashlib.md5(url.encode('utf-8')).hexdigest()
        ext = get_extension(url)
        filename = f"{url_hash}{ext}"
        filepath = IMG_DIR / filename

        if filepath.exists():
            return url, filename, "skipped (exists)"

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        with open(filepath, 'wb') as f:
            f.write(response.content)
            
        return url, filename, "downloaded"
    except Exception as e:
        return url, None, f"error: {str(e)}"

def main():
    if not CONTENT_DIR.exists():
        print(f"Error: Content directory not found at {CONTENT_DIR}")
        return

    # Create image directory if it doesn't exist
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    
    print(f"Scanning for images in {CONTENT_DIR}...")
    
    image_urls = set()
    
    # Scan Markdown files
    for md_file in CONTENT_DIR.rglob("*.md"):
        try:
            content = md_file.read_text(encoding='utf-8')
            
            # Find Markdown images
            md_matches = MD_IMG_PATTERN.findall(content)
            image_urls.update(md_matches)
            
            # Find HTML images
            html_matches = HTML_IMG_PATTERN.findall(content)
            image_urls.update(html_matches)

            # Find YAML frontmatter images
            yaml_matches = YAML_IMG_PATTERN.findall(content)
            image_urls.update(yaml_matches)
            
        except Exception as e:
            print(f"Error reading file {md_file}: {e}")

    print(f"Found {len(image_urls)} unique remote images.")
    
    # Download images
    mapping = {}
    if MAPPING_FILE.exists():
        try:
            mapping = json.loads(MAPPING_FILE.read_text(encoding='utf-8'))
        except:
            pass

    results = []
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(download_image, url): url for url in image_urls}
        
        for i, future in enumerate(futures):
            url = futures[future]
            try:
                original_url, filename, status = future.result()
                if filename:
                    mapping[original_url] = filename
                    print(f"[{i+1}/{len(image_urls)}] {status}: {original_url} -> {filename}")
                else:
                    print(f"[{i+1}/{len(image_urls)}] {status}: {original_url}")
            except Exception as e:
                print(f"[{i+1}/{len(image_urls)}] Exception for {url}: {e}")

    # Save mapping
    MAPPING_FILE.write_text(json.dumps(mapping, indent=2, ensure_ascii=False), encoding='utf-8')
    print(f"\nDone! Images saved to {IMG_DIR}")
    print(f"Mapping saved to {MAPPING_FILE}")

if __name__ == "__main__":
    main()
