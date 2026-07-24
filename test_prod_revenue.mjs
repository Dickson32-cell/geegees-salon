async function test() {
    try {
        const res = await fetch('https://geegeessalon.com/api/appointments/54', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'completed', revenue: 100 })
        });
        const text = await res.text();
        console.log('Status:', res.status);
        console.log('Response:', text);
    } catch (e) {
        console.log('Error:', e);
    }
}

test();
