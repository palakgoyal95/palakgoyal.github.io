"""Inspect the source animation and export a crisp canvas frame sequence.

The input is never used by the browser. Run this file when replacing the source
video to regenerate `public/frames/frame-00.webp` through
`public/frames/frame-63.webp` and `public/frames/center.webp`.
"""
from pathlib import Path
import json
import cv2
import numpy as np


ROOT = Path(__file__).parent
SOURCE = ROOT / "Woman_moving_head_and_eyes_20260920184902.mp4"
OUT = ROOT / "public" / "frames"
FRAME_COUNT = 64


def read_frame(capture, number):
    capture.set(cv2.CAP_PROP_POS_FRAMES, number)
    ok, frame = capture.read()
    if not ok:
        raise RuntimeError(f"Could not read source frame {number}")
    return frame


def main():
    cap = cv2.VideoCapture(str(SOURCE))
    if not cap.isOpened():
        raise RuntimeError(f"Cannot open {SOURCE}")
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    duration = total / fps if fps else 0
    print(json.dumps({"frames": total, "fps": fps, "width": width, "height": height,
                      "duration_seconds": duration}, indent=2))

    # The source performs one full turn, then holds its direct-to-camera neutral pose.
    # Reserve the final 8% for that neutral hold and sample the preceding full arc.
    neutral_start = round(total * 0.92)
    trajectory_end = neutral_start - 1
    indices = np.rint(np.linspace(0, trajectory_end, FRAME_COUNT, endpoint=True)).astype(int)
    compass = {
        "RIGHT": int(indices[0]), "DOWN-RIGHT": int(indices[8]), "DOWN": int(indices[16]),
        "DOWN-LEFT": int(indices[24]), "LEFT": int(indices[32]), "UP-LEFT": int(indices[40]),
        "UP": int(indices[48]), "UP-RIGHT": int(indices[56]), "CENTER": total - 1,
    }
    print("Compass frame numbers:", json.dumps(compass, indent=2))

    OUT.mkdir(exist_ok=True)
    params = [cv2.IMWRITE_WEBP_QUALITY, 100]
    for output_index, source_index in enumerate(indices):
        cv2.imwrite(str(OUT / f"frame-{output_index:02d}.webp"), read_frame(cap, int(source_index)), params)
    cv2.imwrite(str(OUT / "center.webp"), read_frame(cap, total - 1), params)

    # A contact sheet makes the detected compass positions auditable on replacement videos.
    thumbs = []
    for name, number in compass.items():
        image = read_frame(cap, number)
        image = cv2.resize(image, (240, 135))
        cv2.putText(image, f"{name}: {number}", (8, 126), cv2.FONT_HERSHEY_SIMPLEX,
                    .42, (255, 255, 255), 1, cv2.LINE_AA)
        thumbs.append(image)
    sheet = np.vstack([np.hstack(thumbs[:3]), np.hstack(thumbs[3:6]), np.hstack(thumbs[6:9])])
    cv2.imwrite(str(OUT / "timeline-contact-sheet.webp"), sheet, params)
    cap.release()


if __name__ == "__main__":
    main()
