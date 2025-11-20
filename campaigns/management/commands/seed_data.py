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

class Command(BaseCommand):
    help = 'Seeds the database with initial data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')
        self.seed_campaigns()
        self.seed_products()
        self.seed_customers()
        self.seed_orders()
        self.seed_finance()
        self.seed_loyalty()
        self.seed_payroll()
        self.seed_variants()
        self.seed_suppliers()
        self.seed_operations()
        self.seed_transactions()
        self.seed_notifications()
        self.seed_tasks()
        self.stdout.write(self.style.SUCCESS('Data seeding complete.'))

    def seed_campaigns(self):
        campaigns = [
            {'id': 1, 'name': 'Summer Sale 2025', 'recipients': 2450, 'status': 'sent', 'date': '2025-06-15', 'open_rate': 32.5, 'click_rate': 8.7, 'type': 'promotional'},
            {'id': 2, 'name': 'New Arrivals - June', 'recipients': 2450, 'status': 'sent', 'date': '2025-06-10', 'open_rate': 28.7, 'click_rate': 7.2, 'type': 'promotional'},
        ]
        for data in campaigns:
            Campaign.objects.get_or_create(**data)

        templates = [
            {'id': 1, 'name': 'Summer Sale', 'category': 'promotional', 'type': 'discount', 'preview_url': 'summer_sale.jpg'},
            {'id': 2, 'name': 'New Arrivals', 'category': 'promotional', 'type': 'product_showcase', 'preview_url': 'new_arrivals.jpg'},
        ]
        for data in templates:
            Template.objects.get_or_create(**data)

    def seed_products(self):
        products = [
            {'name': 'Kitenge Print Dress', 'description': 'A beautiful dress', 'sku': 'KTG-001-RED-M', 'category': 'Dresses', 'price': 2500, 'stock': 15, 'location': 'Nairobi', 'status': 'active'},
        ]
        for data in products:
            Product.objects.get_or_create(**data)

    def seed_customers(self):
        customers = [
            {'first_name': 'Wanjiku', 'last_name': 'Mwangi', 'email': 'wanjiku@example.com', 'phone': '712345678', 'location': 'Nairobi', 'total_spent': 12500, 'last_purchase': '2025-06-15', 'status': 'active'},
        ]
        for data in customers:
            Customer.objects.get_or_create(**data)

    def seed_orders(self):
        customer = Customer.objects.first()
        product = Product.objects.first()
        if customer and product:
            order = Order.objects.create(customer=customer, order_date='2025-01-20', expected_delivery='2025-02-19', total=285000, priority='normal', status='sent')
            OrderItem.objects.create(order=order, product=product, quantity=50)

    def seed_finance(self):
        transactions = [
            {'date': '2025-01-15', 'description': 'Sales - Nairobi Store', 'location': 'Nairobi', 'amount': 185000, 'type': 'income', 'status': 'completed'},
        ]
        for data in transactions:
            FinanceTransaction.objects.get_or_create(**data)

    def seed_loyalty(self):
        customer = Customer.objects.first()
        if customer:
            LoyaltyMember.objects.get_or_create(customer=customer, defaults={'points': 42500, 'tier': 'platinum'})
        
        rewards = [
            {'name': '10% Discount Voucher', 'description': 'Get 10% off your next purchase', 'points': 1000, 'category': 'discount', 'stock': 45},
        ]
        for data in rewards:
            Reward.objects.get_or_create(**data)

    def seed_payroll(self):
        employees = [
            {'name': 'John Kamau', 'employee_id': 'EMP001', 'email': 'john.kamau@inspirewear.co.ke', 'phone': '+254 712 345 678', 'national_id': '12345678', 'kra_pin': 'A001234567B', 'department': 'Operations', 'position': 'Production Manager', 'start_date': '2023-01-15', 'status': 'active', 'basic_salary': 65000, 'housing_allowance': 15000, 'transport_allowance': 8000, 'medical_allowance': 5000, 'bank_name': 'KCB Bank', 'account_number': '1234567890', 'payroll_status': 'processed'},
        ]
        for data in employees:
            Employee.objects.get_or_create(employee_id=data['employee_id'], defaults=data)

    def seed_variants(self):
        product = Product.objects.first()
        if product:
            variants = [
                {'product': product, 'variant_name': 'Kitenge Print Dress - Red/M', 'sku': 'KTG-001-RED-M-V', 'size': 'M', 'color': 'Red', 'price': 2500, 'stock': 15, 'location': 'Nairobi', 'status': 'active', 'notes': 'Popular traditional design'},
            ]
            for data in variants:
                Variant.objects.get_or_create(sku=data['sku'], defaults=data)

    def seed_suppliers(self):
        suppliers = [
            {'name': 'Nairobi Textile Mills', 'code': 'NTM-001', 'contact_person': 'James Mwangi', 'category': 'Fabric Suppliers', 'phone': '+254 722 123 456', 'email': 'james@nairotextiles.co.ke', 'address': 'Industrial Area, Nairobi', 'location': 'Nairobi', 'payment_terms': 30, 'status': 'active', 'notes': 'Reliable supplier', 'join_date': '2023-03-15'},
        ]
        for data in suppliers:
            Supplier.objects.get_or_create(code=data['code'], defaults=data)

    def seed_operations(self):
        activities = [
            {'time': '2025-01-15T09:30:00Z', 'activity': 'Morning Inventory Check', 'location': 'Nairobi', 'staff': 'John Mwangi', 'status': 'completed', 'priority': 'high'},
        ]
        for data in activities:
            Activity.objects.get_or_create(**data)

    def seed_transactions(self):
        transactions = [
            {'date': '2025-01-20', 'description': 'Sales - Westgate Mall Store', 'location': 'Nairobi', 'category': 'sales', 'amount': 285000, 'type': 'income', 'status': 'completed', 'notes': 'Weekend sales peak'},
        ]
        for data in transactions:
            AppTransaction.objects.get_or_create(**data)

    def seed_notifications(self):
        notifications = [
            {'title': 'Low Stock Alert', 'message': 'Stock level for Kitenge Print Dress has fallen below minimum threshold.', 'module': 'inventory', 'type': 'alert', 'priority': 'urgent', 'sender': 'Inventory System', 'recipient': 'Inventory Manager'},
        ]
        for data in notifications:
            Notification.objects.get_or_create(**data)

    def seed_tasks(self):
        tasks = [
            {'title': 'Update inventory for new cotton collection', 'description': 'Add new cotton t-shirts, dresses, and pants to the inventory system.', 'assignee': 'Grace Wanjiku', 'priority': 'high', 'due_date': '2025-01-25', 'status': 'todo', 'progress': 0, 'tags': 'inventory,urgent,cotton'},
        ]
        for data in tasks:
            Task.objects.get_or_create(**data)
