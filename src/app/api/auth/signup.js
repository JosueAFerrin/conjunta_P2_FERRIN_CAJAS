import { hash } from 'bcryptjs';
import { query } from '@/libs/mysql';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    const hashedPassword = await hash(password, 12);

    try {
      const result = await query(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword]
      );
      res.status(201).json({ message: 'User created!' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
