import { Producer } from 'sqs-producer';
import { v4 as uuidv4 } from "uuid";

 
const producer: Producer = Producer.create({
  queueUrl: 'https://sqs.us-east-1.amazonaws.com/141264133120/dev-deployment-queue.fifo',
  region: 'us-east-1'
});

export async function send(body: string) {
  producer.send({
    id: uuidv4(),
    body,
    groupId: uuidv4(),
  }).then((res: any) => {
    console.log('from producer: ', res)
  });
}
