import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from utils.prompt_generator import gerar_prompt
from utils.supabase_handler import inserir_olimpiada

load_dotenv()

SIGLAS = ["OBM", "OBMEP", "OBQ", "OBB"]

genai.configure(api_key=os.getenv("AIzaSyBTfhxXptQLh0fipjEFhQQcY-OaNHpxEt8"))
modelo = genai.GenerativeModel("gemini-pro")

for sigla in SIGLAS:
    prompt = gerar_prompt(sigla)
    response = modelo.generate_content(prompt)
    content = response.text.strip()

    try:
        dados = json.loads(content)
        inserir_olimpiada(dados)
        print(f"{sigla} inserida com sucesso.")
    except Exception as e:
        print(f"Erro ao processar {sigla}: {e}")

print("Resposta do Gemini:", content)
