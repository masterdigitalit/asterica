import os
from moviepy import VideoFileClip
from moviepy import *
from moviepy.tools import convert_to_seconds
from moviepy.Clip import Clip
from moviepy.Effect import Effect
from moviepy.video.VideoClip import ImageClip

def crop_video(name, target_aspect_ratio, center):
    clip = VideoFileClip(f'./timeMedia/{name}')
    w, h = clip.size
    current_aspect = w / h

    if abs(current_aspect - target_aspect_ratio) < 1e-3:
        # Aspect ratios match, no crop needed, just write the file
        clip.write_videofile(f'./timeMedia/{name}', codec='libx264', audio_codec='aac')
        clip.close()
        return

    if current_aspect > target_aspect_ratio:
        # Video too wide, crop width
        new_width = int(h * target_aspect_ratio)
        new_height = h
        # Determine x offset based on center
        if center == 'left':
            x_center = new_width / 2
        elif center == 'right':
            x_center = w - new_width / 2
        else:  # center, top, bottom default horizontal center
            x_center = w / 2
        y_center = h / 2
    else:
        # Video too tall, crop height
        new_width = w
        new_height = int(w / target_aspect_ratio)
        x_center = w / 2
        if center == 'top':
            y_center = new_height / 2
        elif center == 'bottom':
            y_center = h - new_height / 2
        else:  # center, left, right default vertical center
            y_center = h / 2


    cropped_clip =clip.cropped(x_center=x_center, y_center=y_center, width=new_width, height=new_height)
    cropped_clip.with_effects([vfx.Margin(left=100, color=(0,0,0))])



    cropped_clip.write_videofile(
        f"./timeMedia/update_{name}",
        codec="libx264",
        audio_codec="aac",
        bitrate="800k",
        audio_bitrate="96k",
        preset='medium',
        threads=os.cpu_count() or 4,
        logger=True,
        ffmpeg_params=[
            "-profile:v", "baseline", "-level", "3.0",
            "-pix_fmt", "yuv420p", "-movflags", "+faststart"
        ]
    )

    clip.close()
    cropped_clip.close()

