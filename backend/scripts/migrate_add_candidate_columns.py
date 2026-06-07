#!/usr/bin/env python3
"""
Simple migration script: adds missing columns to `candidates` table in backend/hrms.db.
Run from repo root: python3 backend/scripts/migrate_add_candidate_columns.py
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'hrms.db')

COLUMNS = {
    'phone': 'TEXT',
    'skills': 'TEXT',
    'education': 'TEXT',
    'experience_years': 'INTEGER',
    'certifications': 'TEXT',
    'projects': 'TEXT',
    'location': 'TEXT',
    'resume_score': 'INTEGER',
    'job_fit': 'INTEGER',
    'recommendation': 'TEXT',
    'ai_analysis': 'TEXT'
}


def get_existing_columns(conn):
    cur = conn.execute("PRAGMA table_info(candidates);")
    return {row[1] for row in cur.fetchall()}


def add_column(conn, name, ctype):
    sql = f"ALTER TABLE candidates ADD COLUMN {name} {ctype};"
    print('Executing:', sql)
    conn.execute(sql)


def main():
    if not os.path.exists(DB_PATH):
        print('DB not found at', DB_PATH)
        return

    conn = sqlite3.connect(DB_PATH)
    try:
        existing = get_existing_columns(conn)
        to_add = [(n,t) for n,t in COLUMNS.items() if n not in existing]
        if not to_add:
            print('No columns to add. DB is up to date.')
            return
        for name, ctype in to_add:
            add_column(conn, name, ctype)
        conn.commit()
        print('Migration complete. Added columns:', [n for n,_ in to_add])
    except Exception as e:
        print('Migration failed:', e)
    finally:
        conn.close()


if __name__ == '__main__':
    main()
