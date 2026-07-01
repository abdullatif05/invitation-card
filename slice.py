from PIL import Image

def slice_sprites():
    img = Image.open(r'public\images\spritsheet.png').convert('RGBA')
    crop_box = (620, 1150, 1010, 1370)
    crop = img.crop(crop_box)
    bg = crop.getpixel((0,0))
    
    first = 39
    last = 388
    chunk = (last - first) / 6
    
    for i in range(6):
        left = int(first + i*chunk)
        right = int(first + (i+1)*chunk)
        frame = crop.crop((left-3, 0, right+3, crop.height))
        
        data = frame.getdata()
        new_data = []
        for p in data:
            if sum(abs(p[j] - bg[j]) for j in range(3)) < 40:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(p)
        frame.putdata(new_data)
        
        # trim empty vertical space
        v_proj = []
        for y in range(frame.height):
            hits = sum(1 for px in range(frame.width) if frame.getpixel((px,y))[3] > 0)
            v_proj.append(hits)
        top = 0
        while top < frame.height and v_proj[top] == 0: top += 1
        bottom = frame.height - 1
        while bottom > 0 and v_proj[bottom] == 0: bottom -= 1
        
        if top < bottom:
            frame = frame.crop((0, top, frame.width, bottom))
            
        frame.save(f'public\\images\\frames\\frame_{i+1}.png')
        print(f"Saved frame {i+1} size {frame.size}")

if __name__ == '__main__':
    slice_sprites()
