import random
from django.core.management.base import BaseCommand
from campaigns.models import Campaign, Template
from products.models import Product
from customers.models import Customer
from orders.models import Order, OrderItem
from finance.models import Transaction as FinanceTransaction
from loyalty.models import LoyaltyMember, Reward
from payroll.models import Employee
from variants.models import Variant
from suppliers.models import Supplier
from operations.models import Activity
from transactions.models import Transaction as AppTransaction
from notifications.models import Notification
from task_management.models import Task
from django.utils import timezone
from datetime import timedelta
from django.db import transaction
from faker import Faker

class Command(BaseCommand):
    help = 'Seeds the database with abundant and realistic initial data for all apps'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database with a large volume of realistic data...')
        fake = Faker('en_KE')  # Use Kenyan locale for more relevant names

        self.seed_customers(60, fake)
        self.seed_products(300, fake)
        self.seed_suppliers(60, fake)
        self.seed_campaigns()
        self.seed_orders(150)
        self.seed_finance(600, fake)
        self.seed_loyalty()
        self.seed_payroll(30, fake)
        self.seed_variants()
        self.seed_operations(150, fake)
        self.seed_app_transactions(300, fake)
        self.seed_notifications(90)
        self.seed_tasks(120, fake)
        
        self.stdout.write(self.style.SUCCESS('Large-scale realistic data seeding complete.'))

    def seed_campaigns(self):
        # This data is specific and doesn't need to be faked
        self.stdout.write('Seeding Campaigns and Templates...')
        # ... (same as before)

    def seed_products(self, num_products, fake):
        self.stdout.write(f'Seeding {num_products} Products...')
        categories = ['Dresses', 'Pants', 'Accessories', 'Footwear', 'Tops']
        for i in range(num_products):
            product_name = f'{fake.word().capitalize()} {random.choice(categories)[:-1]}'
            Product.objects.get_or_create(
                sku=f'SKU-{i+1:04d}',
                defaults={
                    'name': product_name,
                    'description': fake.sentence(nb_words=10),
                    'category': random.choice(categories),
                    'price': random.randint(10, 50) * 100,
                    'stock': random.randint(0, 200),
                    'location': random.choice(['Nairobi', 'Mombasa', 'Kisumu']),
                    'status': random.choice(['active', 'active', 'active', 'inactive', 'out-of-stock']),
                }
            )

    def seed_customers(self, num_customers, fake):
        self.stdout.write(f'Seeding {num_customers} Customers...')
        for i in range(num_customers):
            first_name = fake.first_name()
            last_name = fake.last_name()
            Customer.objects.get_or_create(
                email=fake.unique.email(),
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                    'phone': f'7{random.randint(0, 99):02d}{random.randint(0, 999999):06d}',
                    'location': random.choice(['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru']),
                    'total_spent': random.uniform(500, 50000),
                    'last_purchase': timezone.now() - timedelta(days=random.randint(1, 365)),
                    'status': random.choice(['active', 'active', 'inactive', 'pending']),
                }
            )

    def seed_orders(self, num_orders):
        # ... (logic remains the same, but will use faked customers/products)
        self.stdout.write(f'Seeding {num_orders} Orders...')
        # ...

    def seed_finance(self, num_transactions, fake):
        self.stdout.write(f'Seeding {num_transactions} Finance Transactions...')
        for i in range(num_transactions):
            FinanceTransaction.objects.create(
                date=timezone.now() - timedelta(days=random.randint(1, 365)),
                description=fake.sentence(nb_words=4),
                location=random.choice(['Nairobi', 'Mombasa', 'Online']),
                amount=random.uniform(1000, 500000),
                type=random.choice(['income', 'expense']),
                status=random.choice(['completed', 'pending', 'failed'])
            )

    def seed_loyalty(self):
        # ... (logic remains the same)
        self.stdout.write('Seeding Loyalty Data...')
        # ...

    def seed_payroll(self, num_employees, fake):
        self.stdout.write(f'Seeding {num_employees} Employees...')
        for i in range(num_employees):
            name = fake.name()
            Employee.objects.get_or_create(
                employee_id=f'EMP{i:03d}',
                defaults={
                    'name': name,
                    'email': f'{name.lower().replace(" ", ".")}@inspirewear.co.ke',
                    'phone': f'+2547{random.randint(0, 99):02d}{random.randint(0, 999999):06d}',
                    'national_id': f'{random.randint(10000000, 40000000)}',
                    'kra_pin': f'A{random.randint(0, 999999999):09d}X',
                    'department': random.choice(['Operations', 'Sales', 'Marketing', 'Admin', 'Finance']),
                    'position': 'Staff',
                    'start_date': timezone.now() - timedelta(days=random.randint(30, 1000)),
                    'status': 'active',
                    'basic_salary': random.randint(300, 800) * 100,
                    'housing_allowance': random.randint(50, 150) * 100,
                    'transport_allowance': random.randint(30, 80) * 100,
                    'medical_allowance': random.randint(20, 50) * 100,
                    'bank_name': 'KCB Bank',
                    'account_number': f'1234567{i:03d}',
                    'payroll_status': 'processed'
                }
            )

    def seed_variants(self):
        # ... (logic remains the same)
        self.stdout.write('Seeding Variants...')
        # ...

    def seed_suppliers(self, num_suppliers, fake):
        self.stdout.write(f'Seeding {num_suppliers} Suppliers...')
        for i in range(num_suppliers):
            company = fake.company()
            Supplier.objects.get_or_create(
                code=f'SUP{i:03d}',
                defaults={
                    'name': company,
                    'contact_person': fake.name(),
                    'category': random.choice(['Fabric Suppliers', 'Accessories', 'Leather Goods']),
                    'phone': f'+2547{random.randint(0, 99):02d}{random.randint(0, 999999):06d}',
                    'email': f'contact@{company.lower().replace(" ", "")}.com',
                    'address': fake.address().replace('\n', ', '),
                    'location': 'Nairobi',
                    'payment_terms': 30,
                    'status': 'active',
                    'join_date': timezone.now() - timedelta(days=random.randint(30, 1000)),
                    'rating': random.uniform(3.5, 5.0)
                }
            )

    def seed_operations(self, num_activities, fake):
        self.stdout.write(f'Seeding {num_activities} Operations Activities...')
        employees = list(Employee.objects.values_list('name', flat=True))
        if not employees:
            employees = ['Default Staff']
        for i in range(num_activities):
            Activity.objects.create(
                time=timezone.now() - timedelta(hours=random.randint(1, 100)),
                activity=fake.sentence(nb_words=3),
                location=random.choice(['Nairobi', 'Mombasa', 'Kisumu']),
                staff=random.choice(employees),
                status=random.choice(['completed', 'in-progress', 'pending']),
                priority=random.choice(['low', 'medium', 'high'])
            )

    def seed_app_transactions(self, num_transactions, fake):
        self.stdout.write(f'Seeding {num_transactions} App Transactions...')
        for i in range(num_transactions):
            AppTransaction.objects.create(
                date=timezone.now() - timedelta(days=random.randint(1, 365)),
                description=fake.sentence(nb_words=4),
                location=random.choice(['Nairobi', 'Mombasa', 'Online']),
                category=random.choice(['sales', 'supplies', 'salaries', 'rent']),
                amount=random.uniform(1000, 500000),
                type=random.choice(['income', 'expense']),
                status=random.choice(['completed', 'pending', 'failed'])
            )

    def seed_notifications(self, num_notifications):
        # ... (logic remains the same)
        self.stdout.write(f'Seeding {num_notifications} Notifications...')
        # ...

    def seed_tasks(self, num_tasks, fake):
        self.stdout.write(f'Seeding {num_tasks} Tasks...')
        employees = list(Employee.objects.values_list('name', flat=True))
        if not employees:
            return
        for i in range(num_tasks):
            Task.objects.create(
                title=fake.sentence(nb_words=4),
                description=fake.paragraph(nb_sentences=2),
                assignee=random.choice(employees),
                priority=random.choice(['low', 'medium', 'high']),
                due_date=timezone.now() + timedelta(days=random.randint(-10, 30)),
                status=random.choice(['todo', 'in-progress', 'review', 'completed']),
                progress=random.randint(0, 100)
            )
