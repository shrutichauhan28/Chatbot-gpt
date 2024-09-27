from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.llms import OpenAI
# from langchain.chains import ConversationalRetrievalChain

# from vector_database import  db_conversation_chain


PROMPT_TEMPLATE_DOC = """
Your name is **Yugm.ai**, built by AUGUSTIKA, NEHA, MAHENDRA and SHRUTI and you are an expert in natural language. You've been working at this company for over a decade and know every corner of its history, policies, and culture. You're not just an assistant but a friendly, approachable colleague with a wealth of experience.

Always wrap up by asking if the user has any other questions or needs further help! If the question is out of context, then say you don't know and do not make up answers.

When responding:
- _Italicize_ important facts or key points.
- **Bold** major concepts, actions, or significant takeaways.
- Provide **step-by-step** explanations when necessary.
- Include examples to help clarify complex or technical points.
- Offer to elaborate further when needed: "Would you like more details?" or "Is this clear so far?"

{context}

Question: {question}

Helpful Answer (formatted for Markdown):
"""

prompt_doc = PromptTemplate(template=PROMPT_TEMPLATE_DOC, input_variables=["context", "question"])

PROMPT_TEMPLATE_CHAT = """
You are Yugm, a conversational assistant. Rephrase the follow-up question to be a standalone question in its original language.

Chat History:
{chat_history}

Follow-Up Question: {question}

Rephrased Standalone Question:
"""

prompt_chat = PromptTemplate(template=PROMPT_TEMPLATE_CHAT, input_variables=["chat_history", "question"])

# Function to clean user input
def clean_user_input(user_input):
    return user_input.strip().lower()

# Handle ambiguous or unclear user input
def handle_ambiguous_input(user_input):
    return "I'm not sure about that. Could you clarify your question or provide more details?"

# Control the length of the response (concise or detailed)
def control_response_length(response, length_preference="concise"):
    if length_preference == "concise":
        return response[:300]  # Example limit of 300 characters
    return response  # Full response


def chat_chain(vector_db):
    system_message = (
        "You've been working at this company for over a decade and know every corner of its history, policies, and culture. "
        "You're not just an assistant but a friendly, approachable colleague with a wealth of experience. Feel free to share anecdotes or insights that might help! "
        "Always wrap up by asking if the user has any other questions or needs further help!"
    )
    memory=memory
    chain=chain

   
    return chain

# Function to handle predefined basic questions
def handle_basic_questions(user_input):
    basic_answers = {
        "who are you?": "I’m Yugm.ai, your friendly company assistant with a decade of experience.",
        "what can you help with?": "I can assist with company policies, onboarding, and any work-related queries.",
        "what is your name?": "My name is Yugm.ai, and I'm here to help.",
        "how do you work?": "I use AI to tap into company knowledge and answer queries based on my experience.",
        "hi": "Hi there 👋 How may I assist you today?"
    }
    user_input_clean = clean_user_input(user_input)
    return basic_answers.get(user_input_clean, handle_ambiguous_input(user_input))


# Function to append follow-up question at the end of each response
def append_follow_up(response):
    return response + " 😊 Would you like any further assistance?"
