from PIL import Image

def extract_bot_avatar():
    img = Image.open(r'public\images\groom_poses_test.png').convert('RGBA')
    # Crop the "Wave" pose
    crop = img.crop((0, 30, 115, 185))
    
    # Remove background
    bg_color = crop.getpixel((0, 0)) # Top left pixel is background
    
    data = crop.getdata()
    new_data = []
    
    # Simple color distance for background removal
    threshold = 10
    for item in data:
        diff = sum(abs(item[i] - bg_color[i]) for i in range(3))
        if diff <= threshold:
            new_data.append((255, 255, 255, 0)) # transparent
        else:
            new_data.append(item)
            
    crop.putdata(new_data)
    crop.save(r'public\images\bot_avatar.png')

extract_bot_avatar()
