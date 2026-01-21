'use client'

import type { User } from './db'
import { users } from './db'

// Simple in-memory session storage for demo
const sessions = new Map<string, User>()

export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function createOrUpdateUser(googleUser: {
  id: string
  email: string
  name: string
  image?: string
}): User {
  const existingUser = users.find((u) => u.googleId === googleUser.id)

  if (existingUser) {
    return existingUser
  }

  const newUser: User = {
    id: `user_${Date.now()}`,
    email: googleUser.email,
    username: googleUser.name.split(' ')[0].toLowerCase(),
    googleId: googleUser.id,
    image: googleUser.image,
    joinDate: new Date().toISOString(),
    status: 'active',
    role: 'user',
    membershipStatus: 'none',
  }

  users.push(newUser)
  return newUser
}

export function setSession(token: string, user: User): void {
  sessions.set(token, user)
}

export function getSession(token: string): User | undefined {
  return sessions.get(token)
}

export function removeSession(token: string): void {
  sessions.delete(token)
}

export function findUserByGoogleId(googleId: string): User | undefined {
  return users.find((u) => u.googleId === googleId)
}

export function findUserById(id: string): User | undefined {
  return users.find((u) => u.id === id)
}

export function updateUserMembership(
  userId: string,
  membershipStatus: 'none' | 'pending' | 'approved',
  paymentProof?: string
): User | undefined {
  const user = users.find((u) => u.id === userId)
  if (user) {
    user.membershipStatus = membershipStatus
    if (paymentProof) {
      user.membershipPaymentProof = paymentProof
    }
    if (membershipStatus === 'approved') {
      user.role = 'userVIP'
      user.membershipDate = new Date().toISOString()
    }
  }
  return user
}
