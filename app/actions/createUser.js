'use server';
import { createAdminClient } from '@/config/appwrite';
import { Account, ID } from 'node-appwrite';

export async function createUser(previousState, formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirm-password');

  if (!email || !name || !password) {
    return {
      error: 'Please fill in all fields',
    };
  }

  if (password.length < 8) {
    return {
      error: 'Password must be at least 8 characters long',
    };
  }

  if (password !== confirmPassword) {
    return {
      error: 'Passwords do not match',
    };
  }

  const { account } = await createAdminClient(); // using the Admin SDK

  try {
    await account.create(ID.unique(), email, password, name);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Registration Error:', error);
    return {
      error: 'Could not register user',
    };
  }
}

