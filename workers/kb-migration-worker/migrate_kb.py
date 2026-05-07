from pathlib import Path
import csv


def load_migration_map(path: str) -> list[dict]:
    with open(path, newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def main() -> None:
    map_path = Path("knowledge-base/migration-map/migration-template.csv")
    if not map_path.exists():
        print("Migration map not found. Run from repository root.")
        return

    rows = load_migration_map(str(map_path))
    print(f"Loaded {len(rows)} KB migration rows.")
    for row in rows:
        print(f"- {row.get('source_id')}: {row.get('title')} [{row.get('status')}]")


if __name__ == "__main__":
    main()
