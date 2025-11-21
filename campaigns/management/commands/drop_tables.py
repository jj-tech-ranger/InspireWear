from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Drops all tables from the database.'

    def handle(self, *args, **kwargs):
        with connection.cursor() as cursor:
            self.stdout.write("Fetching all tables from the database...")
            # For Oracle, we need to find user tables
            cursor.execute("SELECT table_name FROM user_tables")
            tables = [row[0] for row in cursor.fetchall()]

            if not tables:
                self.stdout.write(self.style.SUCCESS("No tables found to drop."))
                return

            self.stdout.write(f"Found tables: {', '.join(tables)}")
            
            # Oracle requires disabling foreign key constraints before dropping tables
            # or dropping them in a specific order. A simpler approach for development
            # is to drop them with CASCADE CONSTRAINTS.
            for table_name in tables:
                self.stdout.write(f"Dropping table {table_name}...")
                try:
                    cursor.execute(f'DROP TABLE "{table_name}" CASCADE CONSTRAINTS')
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Could not drop table {table_name}: {e}"))

        self.stdout.write(self.style.SUCCESS('All tables dropped successfully.'))
