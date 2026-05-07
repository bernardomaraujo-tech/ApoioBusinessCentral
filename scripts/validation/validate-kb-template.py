from pathlib import Path

REQUIRED_SECTIONS = [
    "## Metadados",
    "## Problema",
    "## Diagnóstico",
    "## Solução",
    "## Procedimento",
    "## Validação final",
    "## Notas",
]


def validate_article(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    return [section for section in REQUIRED_SECTIONS if section not in text]


def main() -> None:
    folder = Path("knowledge-base/samples")
    errors = False
    for article in folder.glob("*.md"):
        missing = validate_article(article)
        if missing:
            errors = True
            print(f"{article}: missing {missing}")
        else:
            print(f"{article}: OK")

    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
