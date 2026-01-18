import os
import json
from pathlib import Path

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
CONTENT_DIR = PROJECT_ROOT / "src" / "content" / "posts"
IMG_DIR = PROJECT_ROOT / "src" / "content" / "img"
MAPPING_FILE = PROJECT_ROOT / "scripts" / "url_mapping.json"

def main():
    if not MAPPING_FILE.exists():
        print(f"Error: Mapping file not found at {MAPPING_FILE}")
        print("Please run dl-cloudimg.py first.")
        return

    try:
        mapping = json.loads(MAPPING_FILE.read_text(encoding='utf-8'))
    except Exception as e:
        print(f"Error reading mapping file: {e}")
        return

    if not mapping:
        print("Mapping is empty.")
        return

    print(f"Loaded {len(mapping)} image mappings.")
    print(f"Scanning files in {CONTENT_DIR}...")

    # Sort URLs once
    sorted_urls = sorted(mapping.keys(), key=len, reverse=True)

    replaced_total = 0
    files_modified = 0

    # Walk through all markdown files
    for md_file in CONTENT_DIR.rglob("*.md"):
        try:
            content = md_file.read_text(encoding='utf-8')
            original_content = content
            
            # Calculate relative path from this markdown file to the image directory
            # e.g. posts/a.md -> img/ is ../img/
            try:
                # relpath(target, start)
                rel_path = os.path.relpath(IMG_DIR, md_file.parent)
                # Normalize to forward slashes for Markdown/HTML
                rel_path = rel_path.replace(os.sep, '/')
            except ValueError:
                print(f"Skipping {md_file}: Cannot calculate relative path.")
                continue

            file_replaced_count = 0
            
            # Iterate over all mapped URLs
            for url in sorted_urls:
                if url in content:
                    filename = mapping[url]
                    local_path = f"{rel_path}/{filename}"
                    
                    # Count occurrences
                    count = content.count(url)
                    if count > 0:
                        content = content.replace(url, local_path)
                        file_replaced_count += count
            
            if content != original_content:
                md_file.write_text(content, encoding='utf-8')
                print(f"Modified {md_file.name}: Replaced {file_replaced_count} links.")
                files_modified += 1
                replaced_total += file_replaced_count
                
        except Exception as e:
            print(f"Error processing {md_file}: {e}")

    print(f"\nDone! Modified {files_modified} files, replaced {replaced_total} links.")

if __name__ == "__main__":
    main()
