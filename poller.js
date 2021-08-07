const { Consumer } = require('sqs-consumer');
 
const app = Consumer.create({
  queueUrl: 'https://sqs.us-east-1.amazonaws.com/141264133120/dev-deployment-queue.fifo',
  handleMessage: async (message) => {
    console.log(message);
    return;
    // process.exit();
  }
});
 
app.on('error', (err) => {
  console.error(err.message);
});
 
app.on('processing_error', (err) => {
  console.error(err.message);
});
 
app.start();