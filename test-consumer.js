const { Consumer } = require("sqs-consumer");
// const AWS = require('aws-sdk');

const app = Consumer.create({
  queueUrl:
    "https://sqs.us-east-1.amazonaws.com/141264133120/dev-deployment-queue.fifo",
  region: "us-east-1",
  handleMessage: async (message) => {
    console.log(message);
    // const deploymentRequest = JSON.parse(message.Body);
    // console.log(deploymentRequest);
    // const { exitCode, processOutput } = await executeDeployment(deploymentRequest);
    // console.log('EXIT CODE:', exitCode);
    // console.log(processOutput);
    // await axios.post(`${process.env.HOSTING_API_ADDRESS}`, { exitCode, processOutput });
    return;
  },
});

app.on("error", (err) => {
  console.error(err.message);
});

app.on("processing_error", (err) => {
  console.error(err.message);
});

app.start();

console.log("hello");
