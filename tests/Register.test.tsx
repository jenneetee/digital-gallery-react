import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { it, expect, describe, vi } from 'vitest'
import '@testing-library/jest-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import Register from '../src/Register'

// Mock Firebase methods
vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    getAuth: vi.fn(() => ({
      setPersistence: vi.fn(),
    })),
    createUserWithEmailAndPassword: vi.fn(),
    fetchSignInMethodsForEmail: vi.fn(),
    updateProfile: vi.fn(),
    browserLocalPersistence: {},
  }
})

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    getFirestore: vi.fn(),
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    collection: vi.fn(() => ({})), // Mock collection reference
    query: vi.fn(),
    where: vi.fn(),
  }
})

describe('Register component', () => {
  it('renders the form correctly', () => {
    render(
      <Router>
        <Register />
      </Router>
    )

    // Check if the form elements are rendered
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    // Import the Firebase methods
    const { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, updateProfile } = await import('firebase/auth')
    const { addDoc, getDocs, collection } = await import('firebase/firestore')

    // Mock the Firebase methods
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({ user: { uid: '123' } })
    vi.mocked(fetchSignInMethodsForEmail).mockResolvedValue([])
    vi.mocked(updateProfile).mockResolvedValue({})
    vi.mocked(addDoc).mockResolvedValue({})
    vi.mocked(getDocs).mockResolvedValue({ empty: true })
    vi.mocked(collection).mockReturnValue({}) // Mock collection reference

    render(
      <Router>
        <Register />
      </Router>
    )

    // Fill in the form fields
    await userEvent.type(screen.getByPlaceholderText('Email'), 'test@example.com')
    await userEvent.type(screen.getByPlaceholderText('Name'), 'Test User')
    await userEvent.type(screen.getByPlaceholderText('Username'), 'testuser')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123')

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /Register/i }))

    // Assert that the Firebase methods were called with the correct values
    expect(fetchSignInMethodsForEmail).toHaveBeenCalledWith(expect.anything(), 'test@example.com')
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password123')
    expect(updateProfile).toHaveBeenCalledWith(expect.anything(), { displayName: 'Test User' })
    expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      username: 'testuser',
      password: 'password123',
      createdAt: expect.any(Date),
    })
  })
})