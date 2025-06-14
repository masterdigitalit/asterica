from moviepy.editor import *
import os
MAX_FILE_SIZE_BYTES = 12 * 1024 * 1024 # Максимальный размер файла кружка (12 MB)
CIRCLE_SIZE = 360

with VideoFileClip("0528-1.mp4") as input_video:

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



    output_clip.write_videofile(
        "tests.mp4",
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

