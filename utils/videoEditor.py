import os
from moviepy.editor import *
async def crop_video(name, target_aspect_ratio, center):
    clip = VideoFileClip(f'../timeMedia/{name}')
    w, h = clip.size
    current_aspect = w / h

    if abs(current_aspect - target_aspect_ratio) < 1e-3:
        # Aspect ratios match, no crop needed, just write the file
        clip.write_videofile(f'../timeMedia/{name}', codec='libx264', audio_codec='aac')
        clip.close()
        return

    if current_aspect > target_aspect_ratio:
        # Video too wide, crop width
        new_width = int(h * target_aspect_ratio)
        new_height = h
        # Determine x offset based on center
        if center == 'left':
            x1 = 0
        elif center == 'right':
            x1 = w - new_width
        else:  # center, top, bottom default horizontal center
            x1 = (w - new_width) // 2
        y1 = 0
    else:
        # Video too tall, crop height
        new_width = w
        new_height = int(w / target_aspect_ratio)
        x1 = 0
        if center == 'top':
            y1 = 0
        elif center == 'bottom':
            y1 = h - new_height
        else:  # center, left, right default vertical center
            y1 = (h - new_height) // 2

    x2 = x1 + new_width
    y2 = y1 + new_height

    cropped_clip = clip.crop(x1=x1, y1=y1, x2=x2, y2=y2)

    cropped_clip.write_videofile(
        f"../timeMedia/update_{name}",
        codec="libx264",

        audio_codec="aac" ,
        bitrate="800k",
        audio_bitrate="96k" ,
        preset='medium',
        threads=os.cpu_count() or 4,
        logger=None,
        ffmpeg_params=[
            "-profile:v", "baseline", "-level", "3.0",
            "-pix_fmt", "yuv420p", "-movflags", "+faststart"
        ]
    )
    os.remove(f"../timeMedia/{name}")
    clip.close()
    cropped_clip.close()

async def videoResize(name):
    print(name)
    MAX_FILE_SIZE_BYTES = 12 * 1024 * 1024 # Максимальный размер файла кружка (12 MB)
    CIRCLE_SIZE = 360

    with VideoFileClip(f"../timeMedia/{name}") as input_video:


        w, h = input_video.size
        target_size = CIRCLE_SIZE

        if w > h:
            resized_clip = input_video.resize(height=target_size)
        elif h > w:
            resized_clip = input_video.resize(width=target_size)
        else:
            resized_clip = input_video.resize(width=target_size)


        output_clip = resized_clip.crop(x_center=resized_clip.w / 2,
                                        y_center=resized_clip.h / 2,
                                        width=target_size,
                                        height=target_size)
        final_duration = int(output_clip.duration) if output_clip.duration else 0




