async function test() {
    const res = await fetch('http://localhost:3000/api/appointments');
    const text = await res.text();
    try {
        const data = JSON.parse(text);
        if (data.length > 0) {
            const id = data[0].id;
            console.log('Updating appointment', id);
            const patchRes = await fetch(`http://localhost:3000/api/appointments/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'confirmed' })
            });
            const patchData = await patchRes.json();
            console.log('PATCH response:', patchData);
        } else {
            console.log('No appointments found');
        }
    } catch (e) {
        console.log('Failed to parse GET response:', text.substring(0, 100));
    }
}

test();
