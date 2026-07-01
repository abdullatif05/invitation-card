import os
import json
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional

app = FastAPI(title="Islamic Wedding AI Assistant")

# CORS middleware to allow React app to fetch
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

KB_PATH = os.path.join(os.path.dirname(__file__), "knowledge_base.json")

# Initial base knowledge base fallback
knowledge_base = [
    {
        "keywords": ["groom", "husband", "partner", "man", "zubair", "khot", "abdullatif", "groom's name"],
        "answer": "The groom is Abdullatif Khot, the beloved son of Mr. & Mrs. Zubair Khot. He is marrying Ayesha Kuwari!"
    },
    {
        "keywords": ["bride", "wife", "partner", "woman", "sajid", "kuwari", "ayesha", "bride's name"],
        "answer": "The bride is Ayesha Kuwari, the beloved daughter of Mr. & Mrs. Sajid Kuwari. She is marrying Abdullatif Khot!"
    }
]

# In-memory session store: { session_id: [list of past queries] }
sessions: Dict[str, List[str]] = {}

class ChatRequest(BaseModel):
    message: str
    session_id: str

class ChatResponse(BaseModel):
    reply: str

def clean_tokens(text: str) -> List[str]:
    """Helper to lowercase, remove punctuation and split into word tokens."""
    cleaned = re.sub(r"[^\w\s]", "", text.lower())
    return [word for word in cleaned.split() if len(word) > 1]

def resolve_context(query: str, session_history: List[str]) -> str:
    """
    If query uses pronouns ('it', 'there', 'they', 'then', 'that'),
    append keywords from the last query in session history to enrich search context.
    """
    pronouns = {"it", "there", "they", "then", "that", "venue", "place", "time", "date"}
    query_tokens = set(query.lower().split())
    
    if query_tokens.intersection(pronouns) and session_history:
        # Prepend the last query to build context
        last_query = session_history[-1]
        return f"{last_query} {query}"
    return query

def match_knowledge_base(query: str) -> str:
    """Score knowledge base rows against token overlap and return the best answer."""
    query_lower = query.lower().strip()
    
    # Dynamically reload knowledge_base.json on every request to ensure it's always up-to-date
    kb = []
    if os.path.exists(KB_PATH):
        try:
            with open(KB_PATH, "r", encoding="utf-8") as f:
                kb = json.load(f)
        except Exception as e:
            print(f"Error reading dynamic knowledge base: {e}")
            
    if not kb:
        kb = knowledge_base

    best_score = 0.0
    best_answer = ""
    
    for item in kb:
        keywords = item.get("keywords", [])
        score = 0.0
        
        # 1. Match based on keyword substring search (very robust for "is groom name?")
        for kw in keywords:
            kw_lower = kw.lower()
            if kw_lower in query_lower:
                score += 2.0  # High weight for substring match
                
        # 2. Match based on word token overlap
        query_tokens = set(clean_tokens(query_lower))
        kw_tokens = set()
        for kw in keywords:
            kw_tokens.update(clean_tokens(kw))
            
        overlap = query_tokens.intersection(kw_tokens)
        score += len(overlap) * 0.8
        
        # 3. Specific emphasis weights
        for token in query_tokens:
            if token in ["groom", "bride", "parents", "rsvp", "hotel", "shuttle", "valet"] and token in kw_tokens:
                score += 1.5

        if score > best_score:
            best_score = score
            best_answer = item.get("answer", "")

    # Return matched answer if score is high enough
    if best_score >= 1.5:
        return best_answer
        
    # Check general greeting triggers
    if any(greet in query_lower for greet in ["assalam", "salam", "slm"]):
        return "Walaikum Assalam! May peace and blessings of Allah be upon you. How can I assist you with the Nikah or Walima preparations today?"
    if any(greet in query_lower for greet in ["hello", "hi ", "hi", "hey"]):
        return "Hello! I am Aylif, your digital wedding coordinator. How can I help you?"
    if any(thanks in query_lower for thanks in ["thank", "shukran", "jazak", "jazakallah"]):
        return "Barakallahu feekum (May Allah bless you)! It is my absolute pleasure to assist. Let me know if you need anything else!"
    if "how are you" in query_lower:
        return "Alhamdulillah, I am doing well, ready to guide our honorable guests! How are you doing?"
        
    return ("I am happy to assist! You can ask me about:\n\n"
            "• Event Dates (Nikah/Walima)\n"
            "• Venue Address & GPS Routing\n"
            "• RSVP deadlines & E-Passes\n"
            "• Hotel room blocks & shuttle times\n"
            "• Halal dining menu options")

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    message = request.message.strip()
    session_id = request.session_id.strip()
    
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    # Get session history
    history = sessions.setdefault(session_id, [])
    
    # Resolve pronouns using history
    contextual_query = resolve_context(message, history)
    
    # Match in KB
    reply = match_knowledge_base(contextual_query)
    
    # Update history (keep last 5 queries)
    history.append(message)
    if len(history) > 5:
        history.pop(0)
        
    return ChatResponse(reply=reply)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
