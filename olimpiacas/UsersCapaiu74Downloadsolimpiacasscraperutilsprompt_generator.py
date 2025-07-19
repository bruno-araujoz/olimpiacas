
def gerar_prompt(sigla):
    return f'''
Gere um JSON puro representando a olimpíada científica brasileira "{sigla}" com os seguintes campos:

{{
  "sigla": "{sigla}",
  "nome": "",
  "area": "",
  "publico": "",
  "descricao": "",
  "beneficios": [
    "Texto 1",
    "Texto 2"
  ],
  "como_preparar": [
    "Texto 1",
    "Texto 2"
  ],
  "links": {{
    "site_oficial": "",
    "provas_anteriores": "",
    "materiais_extras": ""
  }}
}}

Não inclua explicações. Apenas o JSON puro.
'''
