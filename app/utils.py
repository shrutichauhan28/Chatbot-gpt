from dataclasses import Field
from fastapi import requests
from langchain.callbacks import get_openai_callback
from pydantic import  BaseSettings
from dotenv import load_dotenv
from functools import lru_cache
import os
import openai


load_dotenv()
def count_tokens(chain, query):
    """
    Calculate cost assosiated
    """
    with get_openai_callback() as cb:
        result = chain({"question" :query})
        # print(f"Source: {source if source else 'Unknown'}")
        print(f"Total Tokens: {cb.total_tokens}")
        print(f"Prompt Tokens: {cb.prompt_tokens}")
        print(f"Completion Tokens: {cb.completion_tokens}")
        print(f"Total Cost (USD): ${cb.total_cost}")

    return result, cb


class Settings(BaseSettings):
    """
    Settings class for this application.
    Utilizes the BaseSettings from pydantic for environment variables.
    """

    openai_api_key: str = os.getenv("OPENAI_API_KEY")
 
    host: str

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    """Function to get and cache settings.
    The settings are cached to avoid repeated disk I/O.
    """
    return Settings()


def initiate_fine_tuning(training_file_id):
    url = "https://api.openai.com/v1/fine_tuning/jobs"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}"
    }
    data = {
        "training_file": training_file_id,
        "model": "gpt-4o-mini"
    }

    response = requests.post(url, headers=headers, json=data)
    return response.json()

def check_fine_tuning_status(job_id):
    url = f"https://api.openai.com/v1/fine_tuning/jobs/ftjob-"
    headers = {
        "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}"
    }

    response = requests.get(url, headers=headers)
    return response.json()

def get_chatbot_response(prompt):
    model = "gpt-4o-mini-2024-07-18"  # replace with your fine-tuned model
    url = "https://api.openai.com/v1/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}"
    }
    data = {
        "model": model,
        "prompt": prompt,
        "max_tokens": 150
    }

    response = requests.post(url, headers=headers, json=data)
    return response.json()