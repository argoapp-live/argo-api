const { Producer } = require('sqs-producer');
 
// create simple producer
const producer = Producer.create({
  queueUrl: 'https://sqs.us-east-1.amazonaws.com/141264133120/dev-deployment-queue.fifo',
  region: 'us-east-1'
});

// export async function checkSize(params:type) {
    
// }

producer.queueSize().then((size: any) => {
    console.log('queue size', size);
});

producer.send({
    id: "testId",
    body: 'Hello world from our FIFO queue!',
    groupId: 'group1234',
  });

export default {};
// console.log(`There are ${size} messages on the queue.`);