#!/usr/bin/env python3
import os
import asyncio
import google.generativeai as genai

# Retrieve the API key from the environment.
# Replace "YOUR_GEMINI_API_KEY" with your key if not using an environment variable.
API_KEY = os.environ.get("GOOGLE_API_KEY", "YOUR_GEMINI_API_KEY")

# Initialize the client with the v1alpha API version.
client = genai.Client(api_key=API_KEY, http_options={'api_version': 'v1alpha'})

async def main():
    # Create a multi-turn chat session using the Gemini 2.0 Flash Thinking Mode.
    chat = client.aio.chats.create(model='gemini-2.0-flash-thinking-exp')
    print("Chat session started. Type 'exit' to quit.\n")
    
    while True:
        # Read user input from the command line.
        user_input = input("You: ")
        if user_input.strip().lower() == "exit":
            break
        
        # Send the user input to the chat session.
        response = await chat.send_message(user_input)
        
        # Iterate through the response parts.
        for part in response.candidates[0].content.parts:
            if part.thought:
                print("\nModel Thought:\n", part.text)
            else:
                print("\nModel Response:\n", part.text)
        print()  # Add an extra newline for readability.
    
    print("Exiting chat session.")

if __name__ == "__main__":
    asyncio.run(main())
