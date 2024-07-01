# Editor Backend v3.0

This is version 3.0 of the editor backend, built using Node.js, Express.js, Docker, Kafka, and Datacube for database operations.

## Setup Instructions

To run the editor backend:

1. Create a `.env` file in the project folder.

Inside the `.env` file, include:

```env
PORT=9000
IP=<your-ip-address>:9092
API_KEY=1b834e07-c68b-4bf6-96dd-ab7cdc62f07f
DATABASE=meta_data_q
COLLECTIONNAME=examplecollection
ZOOKEEPER_HOST=<your-ip-address>
KAFKA_HOST=<your-ip-address>
```

### Docker Commands

To start the backend, use:

```bash
docker-compose up
```

To stop the backend, use:

```bash
docker-compose down
```

## Socket Events

Socket URL: `http://localhost:9000/`

### Emit Event

To emit the `example-event`:

```javascript
import React from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:9000');

const emitEvent = () => {
  const data = {
    name: 'erics',
    location: 'bangalore'
  };
  socket.emit('example-event', data);
  console.log('Event emitted: example-event', data);
};

export default function App() {
  socket.on('exampleData', (data) => {
    console.log('Received event: exampleData', data);
    // Handle the received data here
  });

  return (
    <div>
      <button onClick={emitEvent}>Emit Event</button>
    </div>
  );
}
```

### Receive Event

To handle the `exampleData` event:

```javascript
socket.on('exampleData', (data) => {
  console.log('Received event: exampleData', data);
  // Handle the received data here
});
```

Adjust the event names (`example-event`, `exampleData`) and data payloads according to your application's specific requirements.

---

Replace `<your-ip-address>` with the appropriate IP addresses or hostnames as per your setup.
