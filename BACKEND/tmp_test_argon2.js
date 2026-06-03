import argon2 from 'argon2';

async function test() {
    try {
        const hash = await argon2.hash('password');
        console.log('Hash:', hash);
        const match = await argon2.verify(hash, 'password');
        console.log('Match:', match);
    } catch (error) {
        console.error('Argon2 Error:', error);
    }
}

test();
