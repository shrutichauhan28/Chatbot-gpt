# import os
# import moviepy.editor as mp
# import speech_recognition as sr
# from pydub import AudioSegment

# def extract_audio_from_video(video_path: str, audio_output_path: str):
#     """Extract audio from video using moviepy."""
#     video = mp.VideoFileClip(video_path)
#     video.audio.write_audiofile(audio_output_path)

# def convert_audio_to_text(audio_path: str) -> str:
#     """Convert audio to text using speech recognition."""
#     recognizer = sr.Recognizer()
#     text = ""
#     try:
#         # Load the audio file
#         with sr.AudioFile(audio_path) as source:
#             audio = recognizer.record(source)  # Read the entire audio file

#         # Use the recognizer to convert speech to text
#         text = recognizer.recognize_google(audio)  # or recognize with other ASR tools like whisper
#     except Exception as e:
#         print(f"Error transcribing audio: {e}")
#     return text

# def save_text_to_file(text: str, output_folder: str, file_name: str):
#     """Save the extracted text to a file."""
#     if not os.path.exists(output_folder):
#         os.makedirs(output_folder)
    
#     output_file_path = os.path.join(output_folder, file_name)
#     with open(output_file_path, 'w', encoding='utf-8') as f:
#         f.write(text)
#     print(f"Text saved to: {output_file_path}")

# def extract_text_from_video(video_path: str, output_folder: str = "data"):
#     """
#     Extract text from a given video and save it in the specified output folder.

#     Args:
#         video_path (str): Path to the video file.
#         output_folder (str): Folder to save the extracted text file.
#     """
#     # Define paths for intermediate and output files
#     audio_path = os.path.join(output_folder, "temp_audio.wav")
#     text_file_name = os.path.basename(video_path).replace('.mp4', '.txt').replace('.avi', '.txt')
    
#     try:
#         # Step 1: Extract audio from video
#         print("Extracting audio from video...")
#         extract_audio_from_video(video_path, audio_path)

#         # Step 2: Convert audio to text
#         print("Converting audio to text...")
#         text = convert_audio_to_text(audio_path)

#         # Step 3: Save the text to a file
#         print("Saving text to file...")
#         save_text_to_file(text, output_folder, text_file_name)
#     except Exception as e:
#         print(f"Error processing video: {e}")
#     finally:
#         # Clean up temporary files
#         if os.path.exists(audio_path):
#             os.remove(audio_path)
#         print("Temporary files cleaned up.")

# # Example usage
# video_path = "example_video.mp4"  # Replace with your video file path
# extract_text_from_video(video_path, output_folder="data")
