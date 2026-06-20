#!/usr/bin/env python3
"""AETHERION Editorial OS — analizador local opcional.

Uso:
  python tools/editor_analyzer.py novela.txt --out informe.md

No usa internet ni dependencias externas.
"""
from __future__ import annotations
import argparse
import re
from dataclasses import dataclass
from pathlib import Path
from statistics import mean

STOP = set("""que para como pero porque desde hasta donde cuando todos todas esto esta este ese esa esos esas entre sobre bajo contra hacia durante antes despues después muy mas más menos una uno unas unos los las del con sin por sus tus mis nos soy eres era eran sido ser estar tiene tienen tuve tuvo hay aqui aquí alli allí entonces tambien también solo sólo algo nada todo cada mismo misma""".split())

@dataclass
class Stats:
    words: int
    sentences: int
    paragraphs: int
    avg_sentence: int
    long_sentences: int
    repetitions: list[tuple[str, int]]


def words(text: str) -> list[str]:
    return re.findall(r"[a-záéíóúüñ]{2,}", text.lower(), flags=re.I)


def sentences(text: str) -> list[str]:
    return [s.strip() for s in re.findall(r"[^.!?…]+[.!?…]+|[^.!?…]+$", text) if len(s.strip()) > 2]


def paragraphs(text: str) -> list[str]:
    return [p.strip() for p in re.split(r"\n\s*\n+", text.strip()) if p.strip()]


def repeated(text: str) -> list[tuple[str, int]]:
    counts: dict[str, int] = {}
    for w in words(text):
        if len(w) > 4 and w not in STOP:
            counts[w] = counts.get(w, 0) + 1
    return sorted([(w, n) for w, n in counts.items() if n >= 4], key=lambda x: -x[1])[:12]


def stats(text: str) -> Stats:
    ws = words(text)
    ss = sentences(text)
    lens = [len(words(s)) for s in ss]
    return Stats(
        words=len(ws),
        sentences=len(ss),
        paragraphs=len(paragraphs(text)),
        avg_sentence=round(mean(lens)) if lens else 0,
        long_sentences=sum(1 for n in lens if n > 32),
        repetitions=repeated(text),
    )


def count(text: str, patterns: list[str]) -> int:
    return sum(len(re.findall(p, text, flags=re.I)) for p in patterns)


def clamp(n: int, a: int = 0, b: int = 100) -> int:
    return max(a, min(b, n))


def score_fragment(text: str) -> dict[str, object]:
    st = stats(text)
    action = count(text, [r"golp", r"corre", r"grit", r"sangre", r"muert", r"romp", r"huye", r"dispar", r"amenaz", r"peligro"])
    conflict = count(text, [r"pero", r"sin embargo", r"aunque", r"no pod", r"prohib", r"fall", r"deuda", r"culpa", r"secreto"])
    sensory = count(text, [r"olor", r"fr[ií]o", r"sabor", r"ruido", r"luz", r"sombra", r"piel", r"sangre", r"humo", r"lluvia"])
    abstract = count(text, [r"verdad", r"destino", r"alma", r"mundo", r"silencio", r"oscuridad", r"miedo", r"tiempo"])
    prose = 68
    prose += 9 if 8 <= st.avg_sentence <= 24 else -8
    prose -= min(14, st.long_sentences * 2)
    prose -= min(12, len(st.repetitions) * 2)
    prose += min(8, sensory)
    prose -= min(8, max(0, abstract - sensory))
    prose += 5 if st.paragraphs >= 3 else -5
    tension = 45 + min(25, action * 2) + min(20, conflict * 3) + min(10, len(re.findall(r"[?!¿¡]", text)))
    anti_ai = 100 - min(25, st.long_sentences * 3) - min(22, len(st.repetitions) * 3) - min(18, count(text, [r"no era .* sino", r"como si", r"algo dentro", r"en el fondo", r"la verdad", r"el silencio"]) * 2)
    prose, tension, anti_ai = clamp(prose), clamp(tension), clamp(anti_ai)
    overall = round((prose + tension + anti_ai) / 3)
    return {"stats": st, "prose": prose, "tension": tension, "anti_ai": anti_ai, "overall": overall}


def split_chapters(text: str) -> list[tuple[str, str]]:
    lines = text.splitlines()
    header = re.compile(r"^\s*(cap[ií]tulo\s+[\divxlcdm]+|#{1,3}\s+.+|\d{1,2}[\).\-]\s+.+|acto\s+[ivxlcdm]+)\s*$", re.I)
    chunks: list[tuple[str, str]] = []
    title = "Inicio"
    cur: list[str] = []
    for line in lines:
        if header.match(line) and len("\n".join(cur).strip()) > 250:
            chunks.append((title, "\n".join(cur).strip()))
            title = re.sub(r"^#+\s*", "", line.strip())
            cur = []
        elif header.match(line) and not cur:
            title = re.sub(r"^#+\s*", "", line.strip())
        else:
            cur.append(line)
    if "\n".join(cur).strip():
        chunks.append((title, "\n".join(cur).strip()))
    return [(t, c) for t, c in chunks if len(words(c)) > 60]


def report(text: str) -> str:
    chapters = split_chapters(text)
    if not chapters:
        chapters = [("Texto completo", text)]
    rows = []
    for i, (title, body) in enumerate(chapters, 1):
        s = score_fragment(body)
        problems = []
        if s["tension"] < 58: problems.append("tensión baja")
        if s["prose"] < 62: problems.append("prosa densa/repetida")
        if s["anti_ai"] < 65: problems.append("riesgo IA/plantilla")
        if not problems: problems.append("funciona por métrica")
        rows.append((i, title, s, problems))
    avg = round(mean(r[2]["overall"] for r in rows))
    out = ["# Informe AETHERION Editorial OS", "", f"Resultado global: **{avg}/100**", f"Bloques detectados: **{len(rows)}**", "", "| # | Bloque | Global | Tensión | Prosa | Anti-IA | Problemas |", "|---|---|---:|---:|---:|---:|---|"]
    for i, title, s, problems in rows:
        out.append(f"| {i} | {title.replace('|','/')} | {s['overall']} | {s['tension']} | {s['prose']} | {s['anti_ai']} | {', '.join(problems)} |")
    out.extend(["", "## Prioridad", ""])
    weak = [r for r in rows if r[2]["overall"] < 62 or r[2]["tension"] < 55]
    if weak:
        out.extend(f"- Revisar bloque {i}: {title}. Motivo: {', '.join(problems)}." for i, title, _, problems in weak[:10])
    else:
        out.append("- Pulido fino, lectura humana y revisión KDP.")
    return "\n".join(out)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", help="Archivo .txt o .md con la novela/escaleta")
    parser.add_argument("--out", default="informe_aetherion.md", help="Salida markdown")
    args = parser.parse_args()
    text = Path(args.input).read_text(encoding="utf-8")
    Path(args.out).write_text(report(text), encoding="utf-8")
    print(f"Informe generado: {args.out}")

if __name__ == "__main__":
    main()
