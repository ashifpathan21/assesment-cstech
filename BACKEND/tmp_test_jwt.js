import jwt from 'jsonwebtoken';

try {
    const token = jwt.sign('some-uuid', 'secret', { expiresIn: '1d' });
    console.log('Token created:', token);
} catch (error) {
    console.error('Error:', error.message);
}
