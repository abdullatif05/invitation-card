from PIL import Image

def slice_test():
    img = Image.open(r'public\images\spritsheet.png').convert('RGBA')
    # Right column, around middle
    crop = img.crop((650, 480, 1000, 850))
    crop.save(r'public\images\groom_poses_test.png')

slice_test()
