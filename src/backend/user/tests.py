from django.test import TestCase
from django.contrib.auth.models import User
from .models import Profile, Group
# Create your tests here.


class TestModels(TestCase):
    def setUp(self):
        
        self.user = User.objects.create_user(username='testuser', password='password')
        self.group = Group.objects.create(
            groupName='test group',
            groupCode='test code',
            budget=200.00,
            income=1000.99
        )

    def test_model_group(self):
        # Provjera da se group ispravno kreirao
        self.assertEqual(str(self.group), 'test group')
        self.assertTrue(isinstance(self.group, Group))
        self.assertEqual(self.group.groupCode, 'test code')
        self.assertEqual(float(self.group.budget), 200.00)
        self.assertEqual(float(self.group.income), 1000.99)
    

    def test_model_profile(self):
        

        profile = Profile.objects.create(
            user=self.user,
            group=self.group,
            role='parent',
            isAdmin='True',
            budget=300.11,
            income=1000.99,
            allowance=0,
            wants_notification = False,
            income_date = 1
        )
        self.assertEqual(str(profile), 'Profile(testuser)')
        self.assertTrue(isinstance(profile, Profile))
        self.assertEqual(profile.role, 'parent')
        self.assertTrue(profile.isAdmin)
        self.assertEqual(profile.group, self.group)
        self.assertFalse(profile.wants_notification)
