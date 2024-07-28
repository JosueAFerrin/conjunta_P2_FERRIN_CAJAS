import { compare } from 'bcryptjs';
import { query } from '@/libs/mysql';
import { sign } from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const results = await query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (results.length === 0) {
        return res.status(401).json({ message: 'User not found!' });
      }

      const user = results[0];
      const isValid = await compare(password, user.password);

      if (!isValid) {
        return res.status(401).json({ message: 'Invalid password!' });
      }

      const token = sign(
        { email: user.email, userId: user.id },
        'your_secret_key',
        { expiresIn: '1h' }
      );

      res.status(200).json({ token, userId: user.id });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
