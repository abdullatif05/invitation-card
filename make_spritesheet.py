import imageio
from PIL import Image
import numpy as np

def create_spritesheet():
    reader = imageio.get_reader('public/images/float_character.mp4', 'ffmpeg')
    num_frames = min(reader.count_frames(), 300)
    
    frame_w = 160
    frame_h = 240
    cols = 20
    rows = (num_frames + cols - 1) // cols
    
    sheet_w = cols * frame_w
    sheet_h = rows * frame_h
    
    spritesheet = Image.new('RGB', (sheet_w, sheet_h))
    
    print(f"Creating spritesheet {sheet_w}x{sheet_h} for {num_frames} frames...")
    
    for i, frame_data in enumerate(reader):
        if i >= num_frames:
            break
            
        frame = Image.fromarray(frame_data)
        frame = frame.resize((frame_w, frame_h), Image.Resampling.LANCZOS)
        
        row = i // cols
        col = i % cols
        
        spritesheet.paste(frame, (col * frame_w, row * frame_h))
        
        if (i + 1) % 50 == 0:
            print(f"Processed {i+1} frames...")
            
    # Save as high quality JPEG
    spritesheet.save('public/images/float_spritesheet.jpg', quality=85)
    print("Done! Saved to public/images/float_spritesheet.jpg")

if __name__ == '__main__':
    create_spritesheet()
