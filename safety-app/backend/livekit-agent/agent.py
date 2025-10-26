"""
LiveKit Voice Agent for Women's Safety App
This agent connects to LiveKit and provides voice assistance
"""

import asyncio
import os
from dotenv import load_dotenv
from livekit import rtc
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli, llm
from livekit.agents.voice_assistant import VoiceAssistant
from livekit.plugins import openai, silero

# Load environment variables
load_dotenv()

async def entrypoint(ctx: JobContext):
    """Main entry point for the voice agent"""

    # Connect to the room
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Create the assistant with OpenAI
    assistant = VoiceAssistant(
        vad=silero.VAD.load(),  # Voice Activity Detection
        stt=openai.STT(),  # Speech to Text
        llm=openai.LLM(model="gpt-4o-mini"),  # Language Model
        tts=openai.TTS(voice="alloy"),  # Text to Speech
        chat_ctx=llm.ChatContext().append(
            role="system",
            text=(
                "You are a helpful safety assistant for a women's safety app. "
                "Your role is to provide safety advice, help users assess risk levels in their area, "
                "and offer guidance on staying safe. Be empathetic, supportive, and informative. "
                "Keep responses concise and actionable."
            ),
        ),
    )

    assistant.start(ctx.room)

    # Greet the user
    await assistant.say("Hi! I'm your safety assistant. How can I help you stay safe today?", allow_interruptions=True)


if __name__ == "__main__":
    # Run the agent
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
