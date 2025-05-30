
from PIL import Image
import numpy as np

# Create random noise image (e.g., 4000x4000 pixels)
width, height = 4000, 4000
random_pixels = np.random.randint(0, 256, (height, width, 3), dtype=np.uint8)

img = Image.fromarray(random_pixels, 'RGB')
img.save('large_noisy_image.jpg', quality=95)

print(f"Saved noisy image of size {width}x{height}")