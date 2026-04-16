#!/bin/bash

# Script para renderizar relatórios Markdown em PDF com Estilo Executivo
# Uso: ./render_report.sh <arquivo.md>

if [ -z "$1" ]; then
    echo "Erro: Forneça o arquivo .md para renderizar."
    echo "Uso: ./render_report.sh <arquivo.md>"
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="${INPUT_FILE%.md}.pdf"
CSS_FILE="$(dirname "$0")/executive_report.css"
CONFIG_FILE="$(dirname "$0")/md-to-pdf.config.cjs"

# Prepara o ambiente
export PATH="/usr/local/bin:$PATH"

echo "🚀 Iniciando renderização executiva de: $INPUT_FILE"

# Gera versão com imagens em Base64 para garantir inclusão no PDF
TEMP_MD="${INPUT_FILE%.md}.tmp.md"
python3 "$(dirname "$0")/md_to_base64.py" "$INPUT_FILE" > "$TEMP_MD"

# Executa md-to-pdf via npx no arquivo temporário
npx -y md-to-pdf "$TEMP_MD" \
    --config-file "$CONFIG_FILE" \
    --stylesheet "$CSS_FILE"

# Move o PDF resultante (que terá o nome do arquivo temporário) para o nome correto
mv "${TEMP_MD%.md}.pdf" "$OUTPUT_FILE"

# Limpa o arquivo temporário
rm "$TEMP_MD"

if [ $? -eq 0 ]; then
    echo "✅ PDF gerado com sucesso: $OUTPUT_FILE"
else
    echo "❌ Erro ao gerar PDF."
    exit 1
fi
